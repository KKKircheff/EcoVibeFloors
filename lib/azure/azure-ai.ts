import {createAzure} from '@ai-sdk/azure';
import {AzureEmbeddings} from '@/lib/chat-ai-assistant/azure-embeddings-client';

let azureAIInstance: ReturnType<typeof createAzure> | null = null;
let azureEmbeddingsInstance: AzureEmbeddings | null = null;

const AZURE_CONFIG = {
    resourceName: process.env.AZURE_RESOURCE_NAME || 'kirch-md03vahe-swedencentral',
    apiKey: process.env.AZURE_API_KEY!,
    embeddingsEndpoint: process.env.TEXT_EMBEDDING_3_SMALL_ENDPOINT!,
} as const;

export function getAzureAI(): ReturnType<typeof createAzure> {
    if (!azureAIInstance) {
        if (!AZURE_CONFIG.apiKey) {
            throw new Error('AZURE_API_KEY environment variable is required');
        }

        azureAIInstance = createAzure({
            resourceName: AZURE_CONFIG.resourceName,
            apiKey: AZURE_CONFIG.apiKey,
        });
    }

    return azureAIInstance;
}

export function getAzureEmbeddings(): AzureEmbeddings {
    if (!azureEmbeddingsInstance) {
        if (!AZURE_CONFIG.apiKey) {
            throw new Error('AZURE_API_KEY environment variable is required');
        }
        if (!AZURE_CONFIG.embeddingsEndpoint) {
            throw new Error('TEXT_EMBEDDING_3_SMALL_ENDPOINT environment variable is required');
        }

        azureEmbeddingsInstance = new AzureEmbeddings(AZURE_CONFIG.apiKey, AZURE_CONFIG.embeddingsEndpoint);
    }

    return azureEmbeddingsInstance;
}

export const AZURE_MODELS = {
    CHAT: process.env.AZURE_CHAT_MODEL || 'gpt-5-chat',
    EMBEDDINGS: process.env.AZURE_EMBEDDINGS_MODEL || 'text-embedding-3-small',
} as const;

export function resetAzureAIInstances(): void {
    azureAIInstance = null;
    azureEmbeddingsInstance = null;
}
