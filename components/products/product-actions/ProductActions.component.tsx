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
    removeFromBasketText: string;
    orderSamplesText: string;
}

export default function ProductActions({ product, addToBasketText, removeFromBasketText, orderSamplesText }: ProductActionsProps) {
    const { addItem, removeItem, isInBasket, itemCount } = useSampleBasket();
    const { showToast } = useToast();
    const router = useRouter();

    const inBasket = isInBasket(product.sku);

    const handleToggleBasket = () => {
        if (inBasket) {
            removeItem(product.sku);
            showToast('Sample removed from basket', 'info');
        } else {
            const result = addItem(product);
            if (result.success) {
                showToast(result.message, 'success');
            } else {
                showToast(result.message, result.message.includes('Maximum') ? 'warning' : 'info');
            }
        }
    };

    const handleOrderSamples = () => {
        router.push('/sample-basket');
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PrimaryActionButton
                onClick={handleToggleBasket}
                sx={{ flex: 1 }}
            >
                {inBasket ? removeFromBasketText : addToBasketText}
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
