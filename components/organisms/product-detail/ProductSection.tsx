'use client';

import { Stack, Typography, Container, Box } from '@mui/material';
import { ReactNode } from 'react';

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    description?: string;
    children?: ReactNode;
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    spacing?: number;
    textAlign?: 'left' | 'center' | 'right';
    py?: { xs: number; md: number };
}

export default function ProductSection({
    title,
    subtitle,
    description,
    children,
    backgroundColor = 'background.paper',
    titleColor = 'primary.main',
    textColor = 'text.primary',
    maxWidth = 'lg',
    spacing = 4,
    textAlign = 'left',
    py = { xs: 6, md: 10 }
}: ProductSectionProps) {
    return (
        <Box bgcolor={backgroundColor} py={py}>
            <Container maxWidth={maxWidth}>
                <Stack spacing={spacing} sx={{ textAlign }}>
                    {/* Title */}
                    <Typography
                        variant="h3"
                        color={titleColor}
                        fontWeight={600}
                        sx={{ textAlign: textAlign === 'left' ? { xs: 'center', md: 'left' } : textAlign }}
                    >
                        {title}
                    </Typography>

                    {/* Subtitle */}
                    {subtitle && (
                        <Typography
                            variant="h6"
                            color={textColor}
                            sx={{
                                opacity: 0.8,
                                maxWidth: textAlign === 'center' ? '800px' : 'none',
                                mx: textAlign === 'center' ? 'auto' : 0,
                                lineHeight: 1.6
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}

                    {/* Description */}
                    {description && (
                        <Typography
                            variant="body1"
                            color={textColor}
                            fontSize="1.1rem"
                            lineHeight={1.8}
                            sx={{
                                maxWidth: textAlign === 'center' ? '900px' : 'none',
                                mx: textAlign === 'center' ? 'auto' : 0
                            }}
                        >
                            {description}
                        </Typography>
                    )}

                    {/* Content */}
                    {children && (
                        <Box>
                            {children}
                        </Box>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}