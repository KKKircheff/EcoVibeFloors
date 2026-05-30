import {streamText, convertToModelMessages} from 'ai';
import {getFirestoreAdmin} from '@/lib/firebase/firebase-admin';
import {chatModel, embedText} from '@/lib/ai/config';
import type {VectorSearchResult} from '@/lib/chat-ai-assistant/types';
import {validateMessage} from '@/lib/security/input-validator';

const db = getFirestoreAdmin();

// Translations for API responses (hardcoded since next-intl doesn't work in API routes)
// These match the translations in messages/en.json and messages/bg.json under api.chat namespace
const translations = {
    en: {
        errors: {
            noMessage: 'No message provided',
            processingFailed: 'Failed to process request',
            validation: {
                tooLong: 'Your message is too long. Please keep it under 800 characters.',
                invalidContent: 'Please provide a valid message.',
                tooManySpecialChars: 'Your message contains too many special characters. Please use simpler text.',
                suspiciousPattern: 'Your message contains unusual patterns. Please rephrase your question.',
            },
        },
        systemPrompt: {
            offTopicResponse:
                'Sorry, I can only answer questions related to flooring and our products. You can ask about Floer and Ter Hürne collections, types of parquet, vinyl, laminate, installation, or maintenance. Do you have such a question?',
            sampleBasketPage: 'the sample request page /sample-basket',
            contactPage: 'the contact page /contact',
            languageName: 'English',
        },
    },
    bg: {
        errors: {
            noMessage: 'Не е предоставено съобщение',
            processingFailed: 'Неуспешна обработка на заявката',
            validation: {
                tooLong: 'Вашето съобщение е твърде дълго. Моля, ограничете го до 800 символа.',
                invalidContent: 'Моля, предоставете валидно съобщение.',
                tooManySpecialChars:
                    'Съобщението съдържа твърде много специални символи. Моля, използвайте по-прост текст.',
                suspiciousPattern: 'Съобщението съдържа необични шаблони. Моля, преформулирайте въпроса си.',
            },
        },
        systemPrompt: {
            offTopicResponse:
                'Извинявайте, отговарям само на въпроси, свързани с подови настилки и нашите продукти. Можете да попитате за колекциите Floer и Ter Hürne, видове паркети, винил, ламинат, монтаж или поддръжка. Имате ли такъв въпрос?',
            sampleBasketPage: 'страницата за заявка на мостри /sample-basket',
            contactPage: 'страницата за контакти /contact',
            languageName: 'Bulgarian',
        },
    },
};

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

        // Get locale first
        const locale = (req.headers.get('x-locale') || 'bg') as 'en' | 'bg';
        const t = translations[locale];

        // Handle both old format (content) and new format (parts)
        if (lastMessage?.content) {
            userMessage = lastMessage.content;
        } else if (lastMessage?.parts) {
            // Extract text from parts array
            const textPart = lastMessage.parts.find((part: any) => part.type === 'text');
            userMessage = textPart?.text;
        }

        if (!userMessage) {
            return new Response(JSON.stringify({error: t.errors.noMessage}), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        // Validate and sanitize user input
        const validationResult = validateMessage(userMessage);

        if (!validationResult.isValid) {
            // Log rejected message for security monitoring
            console.warn('Chat input rejected:', {
                errorCode: validationResult.errorCode,
                errorDetails: validationResult.errorDetails,
                messageLength: userMessage.length,
                locale,
                timestamp: new Date().toISOString(),
            });

            // Map validation error codes to translation keys
            let errorMessage = t.errors.validation.invalidContent;
            if (validationResult.errorCode === 'TOO_LONG') {
                errorMessage = t.errors.validation.tooLong;
            } else if (validationResult.errorCode === 'TOO_MANY_SPECIAL_CHARS') {
                errorMessage = t.errors.validation.tooManySpecialChars;
            } else if (validationResult.errorCode === 'SUSPICIOUS_PATTERN') {
                errorMessage = t.errors.validation.suspiciousPattern;
            }

            return new Response(JSON.stringify({error: errorMessage}), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        // Use sanitized input for further processing
        userMessage = validationResult.sanitizedInput!;

        const questionEmbedding = await embedText(userMessage);

        const results = await searchKnowledge(questionEmbedding, locale, 5);

        const context = results
            .map((r, index) => {
                const relevance = r.similarity ? (r.similarity * 100).toFixed(1) : 'N/A';
                let contextStr = `[${index + 1}. ${r.sourceTitle}]\n${r.text}`;

                // Add product details if available
                if (r.contentType === 'product') {
                    if (r.price) {
                        contextStr += `\nPrice: €${r.price.toFixed(2)}`;
                    }
                    if (r.imageUrl) {
                        contextStr += `\n![${r.sourceTitle}](${r.imageUrl})`;
                    }
                    if (r.sourceUrl) {
                        contextStr += `\n[View Product](${r.sourceUrl})`;
                    }
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
- If a question is clearly off-topic (sports, cooking, general travel, politics, etc.), politely respond in ${t.systemPrompt.languageName}:
  "${t.systemPrompt.offTopicResponse}"

CAPABILITY BOUNDARIES:
- You can ONLY provide information from the knowledge base above
- You CANNOT send emails, generate PDFs, arrange physical samples, or perform any external actions
- For sample requests, direct users to: ${t.systemPrompt.sampleBasketPage}
- For contact/project inquiries, direct users to: ${t.systemPrompt.contactPage}
- NEVER promise actions you cannot perform (sending files, emails, physical materials)

GUIDELINES:
- Answer in ${t.systemPrompt.languageName} language
- Be concise, helpful, and professional yet warm
- Base your answer strictly on the context provided above
- If recommending products, mention specific names, features, and prices from the context
- Include relevant details like warranties, specifications, and benefits
- When product images or links are provided in the context, include them in your response to help users visualize and access the products
- Product images appear as markdown ![alt](url) and product links as [View Product](url) - include these in your responses
- If the context doesn't contain relevant information, politely say so and offer to help with related questions about flooring
- Always maintain a luxury brand tone while being approachable
- Use the source titles when referencing specific products or information

IMPORTANT:
- Do not make up information not present in the context
- If asked about products not in the context, acknowledge you don't have that information
- Be helpful and guide users to relevant products/information when possible
- Use icons in the interface only when they are strictly necessary for clarity, functionality
- Remember: You are an information assistant, not a service that can send materials or perform external actions`;

        const modelMessages = convertToModelMessages(messages);

        // Replace last user message content with sanitized input
        const lastMsg = modelMessages[modelMessages.length - 1];
        if (lastMsg?.role === 'user') {
            lastMsg.content = userMessage!;
        }

        const result = streamText({
            model: chatModel,
            system: systemPrompt,
            messages: modelMessages,
            maxOutputTokens: 2048,
            // Disable thinking — not needed for a customer service assistant
            providerOptions: {
                google: {thinkingConfig: {thinkingBudget: 0}},
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Chat API error:', error);

        // Get locale from request header for error message
        const locale = (req.headers.get('x-locale') || 'bg') as 'en' | 'bg';
        const t = translations[locale];

        return new Response(
            JSON.stringify({
                error: t.errors.processingFailed,
                details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
}
