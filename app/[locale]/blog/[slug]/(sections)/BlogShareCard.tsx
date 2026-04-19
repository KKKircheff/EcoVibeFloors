'use client';

import { useState } from 'react';
import { Card, CardContent, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';

interface BlogShareCardProps {
    title: string;
    label: string;
}

export function BlogShareCard({ title, label }: BlogShareCardProps) {
    const [copied, setCopied] = useState(false);

    const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard API unavailable
        }
    };

    const shareLinks = [
        {
            label: 'Facebook',
            icon: <FacebookIcon fontSize="small" />,
            href: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
        },
        {
            label: 'LinkedIn',
            icon: <LinkedInIcon fontSize="small" />,
            href: () =>
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
        },
        {
            label: 'X (Twitter)',
            icon: (
                <Typography component="span" fontWeight={700} fontSize="0.85rem" lineHeight={1}>
                    𝕏
                </Typography>
            ),
            href: () =>
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`,
        },
    ];

    return (
        <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}
                >
                    {label}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Stack direction="row" spacing={0.5}>
                    {shareLinks.map((link) => (
                        <Tooltip key={link.label} title={link.label} placement="top">
                            <IconButton
                                component="a"
                                href={link.href()}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {link.icon}
                            </IconButton>
                        </Tooltip>
                    ))}

                    <Tooltip title={copied ? 'Copied!' : 'Copy link'} placement="top">
                        <IconButton
                            size="small"
                            onClick={handleCopy}
                            sx={{
                                color: copied ? 'primary.main' : 'text.secondary',
                                '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {copied ? <CheckIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Stack>
            </CardContent>
        </Card>
    );
}
