'use client';

import { useState } from 'react';
import { Card, CardContent, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';

interface BlogShareCardProps {
    label: string;
}

export function BlogShareCard({ label }: BlogShareCardProps) {
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
            icon: <FacebookIcon sx={{ fontSize: '2.5rem' }} />,
            href: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
        },
        {
            label: 'LinkedIn',
            icon: <LinkedInIcon sx={{ fontSize: '2.5rem' }} />,
            href: () =>
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
        },
        {
            label: 'Instagram',
            icon: <InstagramIcon sx={{ fontSize: '2.3rem' }} />,
            // TODO: replace with your actual Instagram profile URL
            href: () => 'https://www.instagram.com/ecovibe_floors',
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
                                size="medium"
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
                            size="medium"
                            onClick={handleCopy}
                            sx={{
                                color: copied ? 'primary.main' : 'text.secondary',
                                '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {copied ? <CheckIcon sx={{ fontSize: '2.5rem' }} /> : <LinkIcon sx={{ fontSize: '2.5rem' }} />}
                        </IconButton>
                    </Tooltip>
                </Stack>
            </CardContent>
        </Card>
    );
}
