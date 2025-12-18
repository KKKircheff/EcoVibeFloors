/**
 * Chat Assistant Page
 *
 * Dedicated page for the AI chat assistant
 */

import 'server-only';
import type {Metadata} from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Container, Typography, Box } from '@mui/material';
import { ChatAssistant } from '@/components/chat-ai-assistant/ChatAssistant';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

interface ChatPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export const dynamic = 'error';

export default async function ChatPage({ params }: ChatPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3" gutterBottom>
                    {locale === 'bg' ? 'Чат Асистент' : 'Chat Assistant'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {locale === 'bg'
                        ? 'Задайте ми въпрос за нашите подови настилки и аз ще ви помогна да намерите идеалното решение.'
                        : 'Ask me anything about our flooring solutions and I\'ll help you find the perfect solution.'}
                </Typography>
            </Box>

            <Box sx={{ height: '600px' }}>
                <ChatAssistant embedded />
            </Box>
        </Container>
    );
}
