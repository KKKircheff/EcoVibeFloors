# Chat AI Assistant - Quick Start Guide

## ✅ Implementation Complete!

All core components have been implemented:
- ✅ Mistral embeddings client (1024 dimensions)
- ✅ Embedding generation script with LangChain
- ✅ Streaming chat API with Vercel AI SDK
- ✅ ChatAssistant UI component
- ✅ FloatingChatButton component
- ✅ Chat page route
- ✅ All dependencies installed

## 🚀 Next Steps

### Step 1: Configure Firebase Admin SDK

Ensure your `.env` file contains Firebase Admin credentials:

```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ecovibe-floors.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Note:** The app uses environment variables exclusively. No service account JSON file needed.

### Step 2: Run Embedding Generation (Locally)

```bash
# Dry run first to preview
npx tsx utils/chat-ai-assistant/generate-embeddings.ts --dry-run

# Generate and upload all embeddings (~900 chunks)
npx tsx utils/chat-ai-assistant/generate-embeddings.ts
```

**Expected output:**
```
🚀 Starting Embedding Generation
Mode: LIVE (will upload to Firestore)
Embedding dimensions: 1024
Collection filter: ALL
Rate limit delay: 500ms between requests

📦 Processing Product Collections...
  Collection: hybrid-wood (66 products)
  ✓ Uploaded (1): Classic Evo...
  ...

📄 Processing Website Pages...
  Scraping: https://ecovibefloors.com/en
  ✓ Uploaded (500): Home Page...
  ...

✅ Done! Uploaded 900 chunks
```

**Time:** ~15-20 minutes (with rate limiting)

### Step 3: Create Firestore Vector Index

```bash
# Using the provided script
bash utils/chat-ai-assistant/create-firestore-index.sh

# Or manually with gcloud:
gcloud firestore indexes composite create \
  --project=ecovibe-floors \
  --collection-group=knowledge-base \
  --query-scope=COLLECTION \
  --field-config=field-path=locale,order=ascending \
  --field-config=field-path=category,order=ascending \
  --field-config=field-path=embedding,vector-config='{"dimension":"1024","flat":"{}"}'
```

**Wait 5-15 minutes** for index to build.

Check status:
```bash
gcloud firestore indexes composite list --project=ecovibe-floors
```

### Step 4: Configure Environment Variables for Deployment

Add to Firebase App Hosting environment:

```env
# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key_here

# Azure OpenAI
TARGET_URL=https://your-resource.cognitiveservices.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2025-01-01-preview
AZURE_API_KEY=your_azure_api_key_here

# Firebase Admin (for Firestore access in API route)
FIREBASE_CLIENT_EMAIL=your-service-account@ecovibe-floors.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Get Firebase credentials from:**
Firebase Console → Project Settings → Service Accounts

### Step 5: Deploy

```bash
firebase deploy
```

### Step 6: Test Chat Assistant

**Option 1: Dedicated Chat Page**
- Navigate to `/en/chat` or `/bg/chat`

**Option 2: Add Floating Chat Button (Optional)**

Edit `app/[locale]/layout.tsx`:

```typescript
import { FloatingChatButton } from '@/components/chat-ai-assistant/FloatingChatButton';

export default async function LocaleLayout({ children, params }: Props) {
  // ... existing code

  return (
    <html lang={locale}>
      <body>
        {/* ... existing layout ... */}
        {children}

        {/* Add floating chat button */}
        <FloatingChatButton />
      </body>
    </html>
  );
}
```

## 🧪 Testing

### Test Queries (Bulgarian)

1. "Къде мога да намеря водоустойчив паркет?"
2. "Каква е гаранцията на Hybrid Wood?"
3. "Подходящи ли са за подово отопление?"
4. "Покажи ми дъбови подове"

### Test Queries (English)

1. "What is Hybrid Wood flooring?"
2. "Show me waterproof flooring options"
3. "How much does oak flooring cost?"
4. "Can I install vinyl over existing floors?"

## 📊 Monitor & Debug

### Check Firestore Data
Firebase Console → Firestore → `knowledge-base` collection

### Check API Logs
Firebase Console → Functions → Logs (or Cloud Logging)

### Test Vector Search Manually
```bash
# Coming soon: Test script to verify vector search
npx tsx utils/chat-ai-assistant/test-search.ts "test query"
```

## 💰 Cost Tracking

Monitor usage in:
- Firebase Console → Usage & Billing
- Azure Portal → Cost Management
- Mistral AI Dashboard → Usage

Expected monthly cost: **~$6-15** for moderate usage (500 queries/day)

## 🐛 Troubleshooting

### "findNearest is not a function"
- Vector index not created or not ready yet
- Solution: Wait for index to build (check status with gcloud)

### "No results returned"
- Embeddings not uploaded yet
- Solution: Run `generate-embeddings.ts` script

### "MISTRAL_API_KEY not found"
- Environment variable not set
- Solution: Check `.env` file and deployment config

### TypeScript errors
```bash
npx tsc --noEmit
```

All types should compile successfully ✅

## 📚 Documentation

- Full README: `utils/chat-ai-assistant/README.md`
- Firestore Vector Search: https://firebase.google.com/docs/firestore/vector-search
- Vercel AI SDK: https://sdk.vercel.ai/docs
- Mistral AI: https://docs.mistral.ai/

## 🎉 You're Ready!

The chat AI assistant is fully implemented and ready to use once you:
1. ✅ Generate embeddings locally
2. ✅ Create Firestore vector index
3. ✅ Deploy to Firebase

Happy chatting! 🤖
