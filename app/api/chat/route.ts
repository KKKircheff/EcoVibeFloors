import {streamText} from 'ai';
import {getFirestoreAdmin} from '@/lib/firebase/firebase-admin';
import {getAzureAI, getAzureEmbeddings, AZURE_MODELS} from '@/lib/azure/azure-ai';
import type {VectorSearchResult} from '@/lib/chat-ai-assistant/types';

const db = getFirestoreAdmin();
const embeddings = getAzureEmbeddings();
const azure = getAzureAI();

async function searchKnowledge(
    queryEmbedding: number[],
    locale: 'en' | 'bg',
    limit: number = 5
): Promise<VectorSearchResult[]> {
    try {
        const vectorQuery = db.collection('project-knowledge').where('locale', '==', locale).findNearest({
            vectorField: 'embedding',
            queryVector: queryEmbedding,
            limit,
            distanceMeasure: 'COSINE',
        });

        const snapshot = await vectorQuery.get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as VectorSearchResult[];
    } catch (error) {
        console.error('Vector search error:', error);
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        const {messages} = await req.json();

        // Get last user message (AI SDK v5.0 uses parts array)
        const lastMessage = messages[messages.length - 1];
        let userMessage: string | undefined;

        // Handle both old format (content) and new format (parts)
        if (lastMessage?.content) {
            userMessage = lastMessage.content;
        } else if (lastMessage?.parts) {
            // Extract text from parts array
            const textPart = lastMessage.parts.find((part: any) => part.type === 'text');
            userMessage = textPart?.text;
        }

        if (!userMessage) {
            return new Response(JSON.stringify({error: 'No message provided'}), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        const locale = (req.headers.get('x-locale') || 'bg') as 'en' | 'bg';

        const questionEmbedding = await embeddings.embedQuery(userMessage);

        const results = await searchKnowledge(questionEmbedding, locale, 5);

        const context = results
            .map((r, index) => {
                const relevance = r.similarity ? (r.similarity * 100).toFixed(1) : 'N/A';
                let contextStr = `[${index + 1}. ${r.sourceTitle}]\n${r.text}`;

                // Add product details if available
                if (r.contentType === 'product' && r.price) {
                    contextStr += `\nPrice: €${r.price.toFixed(2)}`;
                }

                contextStr += `\n(Relevance: ${relevance}%)`;
                return contextStr;
            })
            .join('\n\n---\n\n');

        // 4. Build system prompt with RAG context
        const systemPrompt = `You are a helpful AI assistant for EcoVibeFloors, a luxury flooring company in Bulgaria specializing in premium Dutch and German flooring solutions (Floer, Ter Hürne, and Dutch Interior Group brands).

CONTEXT FROM KNOWLEDGE BASE:
${context}

TOPIC BOUNDARIES:
- ONLY answer questions about flooring products, installation, maintenance, specifications, interior design related to floors, home renovation involving flooring, and underfloor heating
- Product names (like "Amsterdam" oak floor collection) ARE relevant - always check the context first before declining
- Related topics (interior design with flooring focus, home renovation, underfloor heating compatibility) ARE acceptable
- If a question is clearly off-topic (sports, cooking, general travel, politics, etc.), politely respond in ${locale === 'bg' ? 'Bulgarian' : 'English'}:
  ${locale === 'bg'
    ? '"Извинявайте, отговарям само на въпроси, свързани с подови настилки и нашите продукти. Можете да попитате за колекциите Floer и Ter Hürne, видове паркети, винил, ламинат, монтаж или поддръжка. Имате ли такъв въпрос?"'
    : '"Sorry, I can only answer questions related to flooring and our products. You can ask about Floer and Ter Hürne collections, types of parquet, vinyl, laminate, installation, or maintenance. Do you have such a question?"'}

CAPABILITY BOUNDARIES:
- You can ONLY provide information from the knowledge base above
- You CANNOT send emails, generate PDFs, arrange physical samples, or perform any external actions
- For sample requests, direct users to: ${locale === 'bg' ? 'страницата за заявка на мостри /sample-basket' : 'the sample request page /sample-basket'}
- For contact/project inquiries, direct users to: ${locale === 'bg' ? 'страницата за контакти /contact' : 'the contact page /contact'}
- NEVER promise actions you cannot perform (sending files, emails, physical materials)

GUIDELINES:
- Answer in ${locale === 'bg' ? 'Bulgarian' : 'English'} language
- Be concise, helpful, and professional yet warm
- Base your answer strictly on the context provided above
- If recommending products, mention specific names, features, and prices from the context
- Include relevant details like warranties, specifications, and benefits
- If the context doesn't contain relevant information, politely say so and offer to help with related questions about flooring
- Always maintain a luxury brand tone while being approachable
- Use the source titles when referencing specific products or information

IMPORTANT:
- Do not make up information not present in the context
- If asked about products not in the context, acknowledge you don't have that information
- Be helpful and guide users to relevant products/information when possible
- Remember: You are an information assistant, not a service that can send materials or perform external actions`;

        // 5. Convert UIMessages to ModelMessages (AI SDK v5.0)
        // UIMessages have parts array, ModelMessages have content string
        const modelMessages = messages.map((msg: any) => {
            let content: string;

            // Handle both old format (content) and new format (parts)
            if (typeof msg.content === 'string') {
                content = msg.content;
            } else if (msg.parts) {
                // Extract text from parts array
                const textParts = msg.parts
                    .filter((part: any) => part.type === 'text')
                    .map((part: any) => part.text)
                    .join('');
                content = textParts;
            } else {
                content = '';
            }

            return {
                role: msg.role,
                content,
            };
        });

        // 6. Stream response with Vercel AI SDK and Azure GPT-5-chat
        const result = streamText({
            model: azure(AZURE_MODELS.CHAT),
            system: systemPrompt,
            messages: modelMessages,
            temperature: 0.7,
            maxOutputTokens: 600,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
}
