'use client';

import { Stack } from '@mui/material';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';
import { useSampleBasket, SampleItem } from '@/lib/contexts/SampleBasketContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { useRouter } from '@/i18n/navigation';
import CheckIcon from '@mui/icons-material/Check';

interface ProductActionsProps {
    product: SampleItem;
    addToBasketText: string;
    orderSamplesText: string;
}

export default function ProductActions({ product, addToBasketText, orderSamplesText }: ProductActionsProps) {
    const { addItem, isInBasket, itemCount } = useSampleBasket();
    const { showToast } = useToast();
    const router = useRouter();

    const inBasket = isInBasket(product.sku);

    const handleAddToBasket = () => {
        const result = addItem(product);
        if (result.success) {
            showToast(result.message, 'success');
        } else {
            showToast(result.message, result.message.includes('Maximum') ? 'warning' : 'info');
        }
    };

    const handleOrderSamples = () => {
        router.push('/sample-basket');
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PrimaryActionButton
                onClick={handleAddToBasket}
                disabled={inBasket}
                sx={{ flex: 1 }}
            >
                {inBasket ? '✓ In Basket' : addToBasketText}
            </PrimaryActionButton>
            <PrimaryActionButton
                onClick={handleOrderSamples}
                variant="outlined"
                sx={{ flex: 1 }}
            >
                {orderSamplesText} {itemCount > 0 ? `(${itemCount})` : ''}
            </PrimaryActionButton>
        </Stack>
    );
}
