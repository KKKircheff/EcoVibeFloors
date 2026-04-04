'use client';

import { Stack, Typography, IconButton, Box } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Image from 'next/image';
import { SampleItem } from '@/lib/contexts/SampleBasketContext';

interface SampleBasketItemProps {
    item: SampleItem;
    onRemove: (sku: string) => void;
    patternLabel: string;
}

export default function SampleBasketItem({ item, onRemove, patternLabel }: SampleBasketItemProps) {
    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                alignItems: 'center',
            }}
        >
            {/* Product Image */}
            <Box
                sx={{
                    position: 'relative',
                    width: 80,
                    height: 80,
                    flexShrink: 0,
                    borderRadius: 1,
                    overflow: 'hidden',
                }}
            >
                <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </Box>

            {/* Product Info */}
            <Stack flex={1} spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {item.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    SKU: {item.sku}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {patternLabel}
                </Typography>
            </Stack>

            {/* Remove Button */}
            <IconButton
                onClick={() => onRemove(item.sku)}
                color="error"
                aria-label="Remove sample"
                sx={{ flexShrink: 0 }}
            >
                <DeleteOutlineIcon />
            </IconButton>
        </Stack>
    );
}
