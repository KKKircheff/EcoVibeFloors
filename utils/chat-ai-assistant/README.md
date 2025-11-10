# Chat AI Assistant - Implementation Guide

## Overview

RAG-powered chat assistant for EcoVibeFloors using:
- **Native Firestore Vector Search** (no extension needed)
- **Azure OpenAI** embeddings (1536 dimensions with text-embedding-3-small)
- **Natural language product descriptions** (optimized for semantic search)
- **Vercel AI SDK** for streaming responses
- **Azure GPT-5-chat** for conversational AI

## Setup Instructions

### 1. Install Dependencies

```bash
npm install ai @ai-sdk/openai
npm install firebase-admin
npm install langchain
```

### 2. Configure Environment Variables

Ensure these are set in your `.env` file:

```env
# Azure OpenAI (Embeddings)
TEXT_EMBEDDING_3_SMALL_ENDPOINT=https://your-endpoint.cognitiveservices.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2023-05-15
AZURE_API_KEY=your_azure_key

# Jina.ai Reader API
JINA_API_KEY=your_jina_key

# Azure OpenAI (Chat)
TARGET_URL=https://your-endpoint.cognitiveservices.azure.com/openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview

# Firebase Admin (for deployment)
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Firebase Admin SDK Credentials

The embedding generation script uses Firebase Admin SDK and requires environment variables (already configured in step 2).

**No service account JSON file needed** - the script uses environment variables exclusively.

### 4. Generate Embeddings (Run Locally)

```bash
# Dry run to preview chunks (no upload)
npx tsx utils/chat-ai-assistant/generate-embeddings.ts --dry-run

# Generate and upload all embeddings
npx tsx utils/chat-ai-assistant/generate-embeddings.ts

# Regenerate specific collection only
npx tsx utils/chat-ai-assistant/generate-embeddings.ts --collection=hybrid-wood
```

**What it does:**
- Loads 135+ products from TypeScript collections
- Converts products to natural language descriptions (1 chunk per product per locale)
- Scrapes 18 website pages with Jina.ai (LangChain chunking)
- Generates 1536-dim embeddings with Azure OpenAI (text-embedding-3-small)
- Uploads chunks to Firestore `project-knowledge` collection with full product metadata

**Estimated time:** 10-20 minutes (depends on rate limits)

**Rate limit configuration:**
- Default delay: 100ms between requests (1500 requests/minute capacity)
- Customize with `--delay=<ms>` flag if needed

### 5. Create Firestore Vector Index

**Option 1: Using Firebase CLI (Recommended)**

The project includes a `firestore.indexes.json` configuration file. Simply deploy it:

```bash
firebase deploy --only firestore:indexes
```

This will create the vector index with:
- Collection: `project-knowledge`
- Fields: `locale` (Ascending) + `embedding` (Vector 1536 dimensions)

**Option 2: Using gcloud CLI:**

```bash
gcloud firestore indexes composite create \
  --project=ecovibe-floors \
  --collection-group=project-knowledge \
  --query-scope=COLLECTION \
  --field-config=field-path=locale,order=ascending \
  --field-config=field-path=embedding,vector-config='{"dimension":"1536","flat":"{}"}'
```

**Option 3: Using Firebase Console:**

⚠️ **Note**: The Firebase Console UI may not show "Vector" option in the field type dropdown. This is a known limitation. Use Firebase CLI or gcloud CLI instead.

If the vector option appears in your console:
1. Go to Firebase Console → Firestore → Indexes
2. Click "Create Index"
3. Collection: `project-knowledge`
4. Add fields:
   - `locale` (Ascending)
   - `embedding` (Vector - 1536 dimensions, Flat index)
5. Click "Create"

**Wait for index to build** (~5-15 minutes)

### 6. Verify Index Status

```bash
# Check index status
gcloud firestore indexes composite list --project=ecovibe-floors
```

Look for status: `READY`

### 7. Deploy to Firebase App Hosting

```bash
firebase deploy
```

Ensure environment variables are set in Firebase App Hosting settings.

## Usage

### Embedding Generation Script

```bash
# Full usage
npx tsx utils/chat-ai-assistant/generate-embeddings.ts [OPTIONS]

# Options:
#   --dry-run              Preview chunks without uploading
#   --collection=<name>    Process only specific collection
#                          (hybrid-wood, oak, click-vinyl, glue-down-vinyl)

# Examples:
npx tsx utils/chat-ai-assistant/generate-embeddings.ts --dry-run
npx tsx utils/chat-ai-assistant/generate-embeddings.ts
npx tsx utils/chat-ai-assistant/generate-embeddings.ts --collection=oak
```

### Chat Assistant Components

**1. Standalone Chat Page:**
```typescript
// Dedicated chat page at /en/chat or /bg/chat
// Already implemented in app/[locale]/chat/page.tsx
```

**2. Floating Chat Button:**
```typescript
// Add to layout for site-wide access
import { FloatingChatButton } from '@/components/chat-ai-assistant/FloatingChatButton';

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <FloatingChatButton />
    </>
  );
}
```

**3. Embedded Chat:**
```typescript
import { ChatAssistant } from '@/components/chat-ai-assistant/ChatAssistant';

<ChatAssistant embedded onClose={handleClose} />
```

## Architecture

### Data Flow

```
User Query
    ↓
1. Generate 1536-dim embedding (Azure OpenAI text-embedding-3-small)
    ↓
2. Vector search in Firestore (findNearest)
    ↓
3. Retrieve top 5 relevant chunks
    ↓
4. Build RAG context
    ↓
5. Stream response from Azure GPT-5-chat
    ↓
6. Display in UI (Vercel AI SDK useChat)
```

### Firestore Document Structure

```typescript
{
  text: "Product: Classic Evo (SKU: 1101280228)\nPrice: €71.42\n...",
  embedding: [0.123, -0.456, ...], // 1536 dimensions (Azure OpenAI)
  locale: "bg",
  contentType: "product",
  category: "hybrid-wood",
  sourceId: "1101280228",
  sourceUrl: "/bg/hybrid-wood/classic-evo-1101280228",
  sourceTitle: "Classic Evo",
  productSku: "1101280228",
  price: 71.42,
  imageUrl: "https://...",
  productData: "{...}", // Full product JSON for reference
  createdAt: Timestamp
}
```

## Cost Estimates

**Monthly costs (500 queries/day):**

- Azure OpenAI embeddings (text-embedding-3-small): 15K queries × $0.00002 = **~$0.30/month**
- Azure GPT-5-chat: 15K queries × ~300 tokens × $0.000001 = **~$4.50/month**
- Firestore:
  - Storage: ~10MB = **Free**
  - Reads: 15K/month = **~$0.05/month**

**Total: ~$5/month** for moderate usage

**Note**: Azure OpenAI embeddings are cheaper than Mistral while providing higher quality (1536 vs 1024 dimensions).

## Troubleshooting

### "Firebase Admin not initialized"

Make sure `serviceAccountKey.json` exists in project root when running the generation script locally.

### "Index not found" error

Vector index is still building. Wait 5-15 minutes after creating the index.

### "Rate limit exceeded" (Azure OpenAI API)

The script includes 100ms delays between requests by default (configured for 1500 requests/minute). If you hit rate limits, increase the delay:

```bash
npx tsx utils/chat-ai-assistant/generate-embeddings.ts --delay=200
```

### TypeScript errors

Run type checking:
```bash
npx tsc --noEmit
```

### Empty search results

1. Verify embeddings were uploaded: Check Firestore Console
2. Verify index is READY: `gcloud firestore indexes composite list`
3. Check locale filter matches your query language

## Files Structure

```
utils/chat-ai-assistant/
├── README.md                    # This file
├── generate-embeddings.ts       # Main embedding generation script
└── pages-to-scrape.ts          # Configuration for web pages

lib/chat-ai-assistant/
├── types.ts                     # TypeScript interfaces
└── azure-embeddings-client.ts  # Azure OpenAI embeddings client (1536 dims)

app/api/chat/
└── route.ts                     # Streaming chat API endpoint

components/chat-ai-assistant/
├── ChatAssistant.tsx           # Main chat UI component
└── FloatingChatButton.tsx      # Floating action button

app/[locale]/chat/
└── page.tsx                     # Dedicated chat page
```

## Next Steps

1. ✅ Run embedding generation script
2. ✅ Create Firestore vector index
3. ✅ Wait for index to build
4. ✅ Deploy to Firebase App Hosting
5. ⏳ Test chat assistant with sample queries
6. ⏳ Add FloatingChatButton to layout (optional)
7. ⏳ Monitor usage and costs

## Support

For issues or questions, check:
- Firestore Vector Search docs: https://firebase.google.com/docs/firestore/vector-search
- Vercel AI SDK docs: https://sdk.vercel.ai/docs
- Azure OpenAI docs: https://learn.microsoft.com/en-us/azure/ai-services/openai/
