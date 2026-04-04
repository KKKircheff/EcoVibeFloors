'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';

interface ProductFeatureProps {
    icon?: string;
    title: string;
    description: string;
    iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    variant?: 'standard' | 'compact';
}

export default function ProductFeature({
    icon,
    title,
    description,
    iconColor = 'primary',
    variant = 'standard'
}: ProductFeatureProps) {
    const cardPadding = variant === 'compact' ? 2 : 3;
    const iconSize = variant === 'compact' ? 40 : 60;

    return (
        <Card
            sx={{
                height: '100%',
                textAlign: 'center',
                p: cardPadding,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <CardContent sx={{ p: 0 }}>
                {icon && (
                    <Box
                        sx={{
                            bgcolor: `${iconColor}.main`,
                            color: `${iconColor}.contrastText`,
                            borderRadius: 2,
                            p: 2,
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: iconSize,
                            height: iconSize,
                            mx: 'auto'
                        }}
                    >
                        <Typography
                            variant={variant === 'compact' ? 'body1' : 'h6'}
                            fontWeight={600}
                            sx={{ fontSize: variant === 'compact' ? '0.9rem' : '1.1rem' }}
                        >
                            {icon}
                        </Typography>
                    </Box>
                )}

                <Typography
                    variant={variant === 'compact' ? 'subtitle1' : 'h6'}
                    color="primary.main"
                    fontWeight={500}
                    gutterBottom
                    sx={{ mb: 2 }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}