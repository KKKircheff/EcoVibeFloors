'use client';

import { Stack } from '@mui/material';
import { useRouter } from '@/i18n/navigation';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';

interface ProductActionsProps {
    orderSamplesText: string;
    contactUsText: string;
}

export default function ProductActions({ orderSamplesText, contactUsText }: ProductActionsProps) {
    const router = useRouter();

    const handleOrderSamples = () => {
        router.push('/contact');
    };

    const handleContactUs = () => {
        router.push('/contact');
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PrimaryActionButton onClick={handleOrderSamples} sx={{ flex: 1 }}>
                {orderSamplesText}
            </PrimaryActionButton>
            <PrimaryActionButton onClick={handleContactUs} variant="outlined" sx={{ flex: 1 }}>
                {contactUsText}
            </PrimaryActionButton>
        </Stack>
    );
}
