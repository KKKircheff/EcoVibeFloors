#!/bin/bash

# Create Firestore Vector Index for Chat AI Assistant
# Run this script after uploading embeddings
#
# IMPORTANT: Index dimension (1024) must match embedding dimension from Mistral AI
# If you change the embedding model, update the dimension here accordingly

echo "🔧 Creating Firestore vector index for knowledge-base collection..."
echo "   (1024 dimensions for Mistral embed model)"
echo ""

gcloud firestore indexes composite create \
  --project=ecovibe-floors \
  --collection-group=knowledge-base \
  --query-scope=COLLECTION \
  --field-config=field-path=locale,order=ascending \
  --field-config=field-path=category,order=ascending \
  --field-config=field-path=embedding,vector-config='{"dimension":"1024","flat":"{}"}'

echo ""
echo "✅ Index creation started!"
echo ""
echo "⏳ The index will take 5-15 minutes to build."
echo ""
echo "To check status:"
echo "  gcloud firestore indexes composite list --project=ecovibe-floors"
echo ""
echo "Look for status: READY"
