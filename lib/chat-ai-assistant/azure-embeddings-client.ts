/**
 * Azure OpenAI client for embeddings
 * Uses Azure OpenAI text-embedding-3-small model with 1536 dimensions
 */

import {AzureOpenAI} from 'openai';

export class AzureEmbeddings {
    private client: AzureOpenAI;
    private deploymentName: string;
    private dimensions: number = 1536; // text-embedding-3-small default dimensions

    constructor(apiKey: string, endpoint: string) {
        if (!apiKey) {
            throw new Error('Azure API key is required');
        }
        if (!endpoint) {
            throw new Error('Azure endpoint is required');
        }

        // Parse the endpoint to extract base URL and deployment name
        // Example: https://kirch-md03vahe-swedencentral.cognitiveservices.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2023-05-15
        const url = new URL(endpoint);
        const pathParts = url.pathname.split('/');
        const deploymentIndex = pathParts.indexOf('deployments');

        if (deploymentIndex === -1 || deploymentIndex + 1 >= pathParts.length) {
            throw new Error('Invalid Azure endpoint format. Expected format: .../deployments/{deployment-name}/...');
        }

        this.deploymentName = pathParts[deploymentIndex + 1];

        // Extract base URL (everything before /openai/...)
        const baseUrl = `${url.protocol}//${url.host}`;

        // Extract API version from query params or use default
        const apiVersion = url.searchParams.get('api-version') || '2023-05-15';

        this.client = new AzureOpenAI({
            apiKey,
            endpoint: baseUrl,
            apiVersion,
        });
    }

    /**
     * Generate embedding for a single text
     */
    async embedQuery(text: string): Promise<number[]> {
        const response = await this.embedDocuments([text]);
        return response[0];
    }

    /**
     * Generate embeddings for multiple texts
     */
    async embedDocuments(texts: string[]): Promise<number[][]> {
        try {
            const response = await this.client.embeddings.create({
                input: texts,
                model: this.deploymentName,
                // Use default 1536 dimensions for text-embedding-3-small
            });

            return response.data
                .sort((a, b) => a.index - b.index)
                .map((item) => item.embedding);
        } catch (error) {
            console.error('Error generating embeddings:', error);
            throw error;
        }
    }

    /**
     * Get embedding dimensions
     */
    getDimensions(): number {
        return this.dimensions;
    }
}
