
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
    Box,
    TextField,
    Button,
    Paper,
    Stack,
    Typography,
    Avatar,
    IconButton,
    Fade,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatAssistantProps {
    onClose?: () => void;
    embedded?: boolean;
}

export function ChatAssistant({ onClose, embedded = false }: ChatAssistantProps) {
    const locale = useLocale() as 'en' | 'bg';
    const t = useTranslations('chatAssistant');

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Frontend validation constants
    const MAX_CHARS = 800;
    const isInputTooLong = input.length > MAX_CHARS;
    const isInputValid = input.trim().length > 0 && !isInputTooLong;

    const { messages, sendMessage, status, error } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
            headers: {
                'x-locale': locale,
            },
        }),
        experimental_throttle: 50,
        onError: (error: Error) => {
            console.error('Chat error:', error);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Frontend validation before sending
        if (isInputValid && status === 'ready') {
            sendMessage({ text: input });
            setInput('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const isLoading = status === 'streaming' || status === 'submitted';

    // Auto-scroll to bottom when new messages arrive or during streaming
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <Paper
            elevation={embedded ? 0 : 3}
            sx={{
                height: embedded ? '100%' : '600px',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'primary.200',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <AutoAwesomeIcon />
                    <Typography variant="h6">
                        {t('title')}
                    </Typography>
                </Stack>

                {onClose && (
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            {/* Messages Area */}
            <Stack
                spacing={2}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: { xs: 1, md: 2 },
                    bgcolor: 'primary.200',
                }}
            >
                {/* Welcome message when no messages */}
                {messages.length === 0 && (
                    <Fade in timeout={500}>
                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'primary.100', borderRadius: 2 }}>
                            <AutoAwesomeIcon sx={{ fontSize: 64, mb: 2, color: 'primary.500' }} />
                            <Typography variant="h6" gutterBottom color='primary.500'>
                                {t('welcome.title')}
                            </Typography>
                            <Typography variant="body1" color='primary.500'>
                                {t('welcome.subtitle')}
                            </Typography>
                        </Box>
                    </Fade>
                )}

                {/* Message bubbles */}
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        py={.5}
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'flex-start',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.dark',
                                width: 36,
                                height: 36,
                            }}
                        >
                            {msg.role === 'user' ? <PersonIcon fontSize="small" /> : <AutoAwesomeIcon fontSize="small" />}
                        </Avatar>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                py: msg.role === 'user' ? 1 : 2,
                                maxWidth: { xs: '80%', md: '75%' },
                                bgcolor: msg.role === 'user' ? 'primary.main' : 'info.50',
                                color: msg.role === 'user' ? 'white' : 'text.primary',
                                borderRadius: 2,
                                wordBreak: 'break-word',
                            }}
                        >
                            {msg.role === 'user' ? (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 500,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {msg.parts.map((part, partIndex) =>
                                        part.type === 'text' ? <span key={partIndex}>{part.text}</span> : null
                                    )}
                                </Typography>
                            ) : (
                                <Box sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                                    <MarkdownRenderer
                                        content={msg.parts
                                            .filter((part) => part.type === 'text')
                                            .map((part) => part.text)
                                            .join('')}
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Box>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <Fade in timeout={200}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                                <AutoAwesomeIcon fontSize="small" />
                            </Avatar>
                            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bggolor: 'info.100' }}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'info.50',
                                            animation: 'pulse 1.4s ease-in-out infinite',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'text.secondary',
                                            animation: 'pulse 1.4s ease-in-out 0.2s infinite',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'text.secondary',
                                            animation: 'pulse 1.4s ease-in-out 0.4s infinite',
                                        }}
                                    />
                                </Stack>
                            </Paper>
                        </Box>
                    </Fade>
                )}

                {/* Error message */}
                {error && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            bgcolor: 'error.light',
                            color: 'error.contrastText',
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2">
                            {t('error.message')}
                        </Typography>
                    </Paper>
                )}

                {/* Invisible scroll anchor */}
                <div ref={messagesEndRef} />
            </Stack>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'primary.200', bgcolor: 'primary.100', borderRadius: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={0.5}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={'center'}>
                            <TextField
                                fullWidth
                                value={input}
                                onChange={handleInputChange}
                                placeholder={t('input.placeholder')}
                                disabled={isLoading}
                                size="small"
                                variant="outlined"
                                error={isInputTooLong}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'background.paper',
                                        py: .2
                                    },
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e as any);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size='small'
                                disabled={isLoading || !isInputValid}
                                endIcon={<SendIcon />}
                                sx={{
                                    minWidth: 100,
                                    borderRadius: 1,
                                    py: .75,
                                }}
                            >
                                {t('input.send')}
                            </Button>
                        </Stack>

                        {/* Character counter */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" px={0.5}>
                            <Typography
                                variant="caption"
                                color={isInputTooLong ? 'error' : 'text.secondary'}
                                sx={{ fontSize: '0.75rem' }}
                            >
                                {isInputTooLong
                                    ? t('input.tooLong', { max: MAX_CHARS })
                                    : t('input.characterCount', { count: input.length, max: MAX_CHARS })}
                            </Typography>
                        </Stack>
                    </Stack>
                </form>
            </Box>

            {/* Keyframe animations */}
            <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </Paper>
    );
}
