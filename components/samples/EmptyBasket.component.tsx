'use client';

import { Stack, Typography } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';
import { useRouter } from '@/i18n/navigation';

interface EmptyBasketProps {
    title: string;
    subtitle: string;
    buttonText: string;
}

export default function EmptyBasket({ title, subtitle, buttonText }: EmptyBasketProps) {
    const router = useRouter();

    const handleBackToCollections = () => {
        router.push('/collections');
    };

    return (
        <Stack
            spacing={3}
            alignItems="center"
            justifyContent="center"
            sx={{
                minHeight: '60vh',
                py: 8,
            }}
        >
            <ShoppingBagOutlinedIcon
                sx={{
                    fontSize: 120,
                    color: 'text.disabled',
                }}
            />
            <Stack spacing={1} alignItems="center">
                <Typography variant="h5" color="text.primary" fontWeight={600}>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    {subtitle}
                </Typography>
            </Stack>
            <PrimaryActionButton
                onClick={handleBackToCollections}
                sx={{ mt: 2 }}
            >
                {buttonText}
            </PrimaryActionButton>
        </Stack>
    );
}
