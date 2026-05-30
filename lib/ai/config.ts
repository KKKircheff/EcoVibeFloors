import {google} from '@ai-sdk/google';
import {embed, embedMany} from 'ai';

// ─── Swap models here ────────────────────────────────────────────────────────
export const chatModel = google('gemini-3.5-flash');
export const embeddingModel = google.textEmbeddingModel('gemini-embedding-001');
export const EMBEDDING_DIMENSIONS = 1536;
// ─────────────────────────────────────────────────────────────────────────────

const embeddingProviderOptions = {
    google: {outputDimensionality: EMBEDDING_DIMENSIONS},
} as const;

export async function embedText(text: string): Promise<number[]> {
    const {embedding} = await embed({
        model: embeddingModel,
        value: text,
        providerOptions: embeddingProviderOptions,
    });
    return embedding;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
    const {embeddings} = await embedMany({
        model: embeddingModel,
        values: texts,
        providerOptions: embeddingProviderOptions,
    });
    return embeddings;
}
