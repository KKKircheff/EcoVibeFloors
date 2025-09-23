'use client';

import { Card, Typography, Stack, Box, Divider } from '@mui/material';

interface SpecItem {
    label: string;
    value: string;
    highlight?: boolean;
}

interface TechnicalSpecsProps {
    title: string;
    specs: SpecItem[];
    variant?: 'card' | 'list';
    titleColor?: string;
}

export default function TechnicalSpecs({
    title,
    specs,
    variant = 'card',
    titleColor = 'secondary.main'
}: TechnicalSpecsProps) {
    const content = (
        <Stack spacing={2}>
            <Typography variant="h6" color={titleColor} fontWeight={500} gutterBottom>
                {title}
            </Typography>

            <Stack spacing={2}>
                {specs.map((spec, index) => (
                    <Box key={index}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{ fontWeight: spec.highlight ? 500 : 400 }}
                            >
                                {spec.label}
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight={500}
                                color={spec.highlight ? 'primary.main' : 'text.primary'}
                                sx={{
                                    bgcolor: spec.highlight ? 'primary.50' : 'transparent',
                                    px: spec.highlight ? 1 : 0,
                                    py: spec.highlight ? 0.5 : 0,
                                    borderRadius: spec.highlight ? 1 : 0
                                }}
                            >
                                {spec.value}
                            </Typography>
                        </Box>
                        {index < specs.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                ))}
            </Stack>
        </Stack>
    );

    if (variant === 'card') {
        return (
            <Card sx={{ p: 3, height: '100%' }}>
                {content}
            </Card>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            {content}
        </Box>
    );
}