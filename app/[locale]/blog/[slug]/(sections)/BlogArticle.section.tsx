'use client';
import React from 'react';
import { Stack, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogContent } from '@/components/atoms/typography/BlogContent';

interface BlogArticleProps {
    content: string;
}

export function BlogArticle({ content }: BlogArticleProps) {
    return (
        <Stack spacing={4}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <Typography variant="h2" component="h1" color="info.500" fontWeight={500} mt={6} mb={3}>
                            {children}
                        </Typography>
                    ),
                    h2: ({ children }) => (
                        <Typography variant="h3" component="h2" color="info.500" fontWeight={500} mt={5} mb={2}>
                            {children}
                        </Typography>
                    ),
                    h3: ({ children }) => (
                        <Typography variant="h4" component="h3" color="info.500" fontWeight={500} mt={4} mb={2}>
                            {children}
                        </Typography>
                    ),
                    p: ({ children }) => (
                        <BlogContent>
                            {children}
                        </BlogContent>
                    ),
                    ul: ({ children }) => (
                        <Stack component="ul" spacing={1} pl={3}>
                            {children}
                        </Stack>
                    ),
                    ol: ({ children }) => (
                        <Stack component="ol" spacing={1} pl={3}>
                            {children}
                        </Stack>
                    ),
                    li: ({ children }) => (
                        <Typography component="li" variant="body1" color="info.400" lineHeight={1.8}>
                            {children}
                        </Typography>
                    ),
                    blockquote: ({ children }) => (
                        <Stack
                            component="blockquote"
                            sx={{
                                borderLeft: '4px solid',
                                borderColor: 'secondary.main',
                                pl: 3,
                                py: 1,
                                my: 3,
                                bgcolor: 'grey.50',
                            }}
                        >
                            {children}
                        </Stack>
                    ),
                    a: ({ href, children }) => (
                        <Typography
                            component="a"
                            href={href}
                            sx={{
                                color: 'primary.main',
                                textDecoration: 'underline',
                                '&:hover': { color: 'primary.dark' },
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    strong: ({ children }) => (
                        <Typography component="strong" fontWeight={600}>
                            {children}
                        </Typography>
                    ),
                    table: ({ children }) => (
                        <Stack component="table" sx={{ width: '100%', borderCollapse: 'collapse', my: 3 }}>
                            {children}
                        </Stack>
                    ),
                    th: ({ children }) => (
                        <Typography
                            component="th"
                            sx={{ borderBottom: '2px solid', borderColor: 'grey.300', p: 1, textAlign: 'left', fontWeight: 600 }}
                        >
                            {children}
                        </Typography>
                    ),
                    td: ({ children }) => (
                        <Typography component="td" sx={{ borderBottom: '1px solid', borderColor: 'grey.200', p: 1 }}>
                            {children}
                        </Typography>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </Stack>
    );
}
