'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';

interface TocItem {
    text: string;
    anchor: string;
}

interface BlogTocCardProps {
    items: TocItem[];
    label: string;
}

export function BlogTocCard({ items, label }: BlogTocCardProps) {
    const [activeAnchor, setActiveAnchor] = useState<string>('');

    useEffect(() => {
        const headingEls = items
            .map(({ anchor }) => document.getElementById(anchor))
            .filter((el): el is HTMLElement => el !== null);

        if (headingEls.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveAnchor(entry.target.id);
                        break;
                    }
                }
            },
            { rootMargin: '0px 0px -70% 0px', threshold: 0 }
        );

        headingEls.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [items]);

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
                <Stack spacing={0.5} component="nav" aria-label="table of contents">
                    {items.map((item) => {
                        const isActive = activeAnchor === item.anchor;
                        return (
                            <Typography
                                key={item.anchor}
                                component="a"
                                href={`#${item.anchor}`}
                                variant="body2"
                                sx={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    lineHeight: 1.8,
                                    pl: isActive ? 1.5 : 0,
                                    borderLeft: isActive ? '3px solid' : '3px solid transparent',
                                    borderColor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                    fontWeight: isActive ? 600 : 400,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { color: 'primary.main', pl: 1.5 },
                                }}
                            >
                                {item.text}
                            </Typography>
                        );
                    })}
                </Stack>
            </CardContent>
        </Card>
    );
}
