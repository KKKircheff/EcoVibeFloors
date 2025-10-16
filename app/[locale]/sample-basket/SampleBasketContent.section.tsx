'use client';

import { Stack, Typography, Button, Divider, Box } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useSampleBasket } from '@/lib/contexts/SampleBasketContext';
import { useToast } from '@/lib/contexts/ToastContext';
import SampleBasketItem from '@/components/samples/SampleBasketItem.component';
import EmptyBasket from '@/components/samples/EmptyBasket.component';
import ContactFormTextField from '@/components/ui/input/ContactFormTextField.component';
import { useRouter } from '@/i18n/navigation';

export type SampleOrderInfo = {
    name: string;
    company?: string;
    phonenumber: string;
    email: string;
    message?: string;
    deliveryAddress: {
        street: string;
        city: string;
        postalCode: string;
    };
};

export default function SampleBasketContent() {
    const t = useTranslations('sampleBasket');
    const tForm = useTranslations('contact.form');
    const tButtons = useTranslations('buttons');
    const tErrors = useTranslations('errors.contact');
    const tPatterns = useTranslations('patterns');

    const { items, removeItem, clearBasket, itemCount } = useSampleBasket();
    const { showToast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { control, reset, handleSubmit } = useForm<SampleOrderInfo>();

    const clearFormFields = () => {
        reset({
            name: '',
            company: '',
            phonenumber: '',
            email: '',
            message: '',
            deliveryAddress: {
                street: '',
                city: '',
                postalCode: '',
            },
        });
    };

    const handleRemoveItem = (sku: string) => {
        removeItem(sku);
        showToast(t('itemRemoved'), 'info');
    };

    const sampleRequestTemplate = (formValues: SampleOrderInfo, created: Date, time_stamp: number) => {
        const samplesHtml = items
            .map(
                (item, index) =>
                    `<li>SKU: ${item.sku} - ${item.productName} (${item.collection}, ${item.pattern}) - €${item.price.toFixed(2)}</li>`
            )
            .join('');

        return {
            to: ['kircheff@protonmail.com', 'georgievgancho@gmail.com', 'contact@ecovibefloors.com'],
            message: {
                subject: `Поръчка на мостри - EcoVibe Floors (${items.length} ${items.length === 1 ? 'продукт' : 'продукта'})`,
                text: 'Sample order request',
                html: `<code>
                    <body>
                    <h2>Нова поръчка на мостри</h2>
                    <p><strong>Дата:</strong> ${created}</p>

                    <h3>Клиент:</h3>
                    <p><strong>Име:</strong> ${formValues.name}</p>
                    <p><strong>Компания:</strong> ${formValues.company || 'Не е посочена'}</p>
                    <p><strong>Телефон:</strong> ${formValues.phonenumber}</p>
                    <p><strong>е-майл:</strong> ${formValues.email}</p>

                    <h3>Адрес за доставка:</h3>
                    <p>${formValues.deliveryAddress.street}</p>
                    <p>${formValues.deliveryAddress.city}, ${formValues.deliveryAddress.postalCode}</p>

                    <h3>Поръчани мостри (${items.length}):</h3>
                    <ol>${samplesHtml}</ol>

                    ${formValues.message ? `<p><strong>Бележки:</strong> ${formValues.message}</p>` : ''}
                    </body>
                    </code>`,
            },
            type: 'sample_request',
            name: formValues.name,
            company: formValues.company,
            email: formValues.email,
            phone: formValues.phonenumber,
            userMessage: formValues.message,
            deliveryAddress: formValues.deliveryAddress,
            samples: items.map((item) => ({
                sku: item.sku,
                productName: item.productName,
                collection: item.collection,
                pattern: item.pattern,
                price: item.price,
            })),
            created,
            time_stamp,
        };
    };

    const submit = async (data: SampleOrderInfo) => {
        if (items.length === 0) {
            showToast(t('emptyBasketError'), 'error');
            return;
        }

        setIsLoading(true);
        try {
            const { addDoc, collection } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            const created = new Date();
            const time_stamp = created.getTime();
            const emailRef = collection(db, 'contacts');
            await addDoc(emailRef, sampleRequestTemplate(data, created, time_stamp));
            setIsLoading(false);
            showToast(t('orderSuccess'), 'success');
            clearFormFields();
            clearBasket();
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (error) {
            setIsLoading(false);
            console.log(`Error: ${error}`);
            showToast(tErrors('submission.error'), 'error');
        }
    };

    // Empty basket state
    if (itemCount === 0) {
        return (
            <EmptyBasket
                title={t('emptyTitle')}
                subtitle={t('emptySubtitle')}
                buttonText={t('backToCollections')}
            />
        );
    }

    return (
        <Stack spacing={6}>
            {/* Header */}
            <Stack spacing={2}>
                <Typography variant="h3" component="h1" color="text.primary">
                    {t('title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('subtitle', { count: itemCount, max: 5 })}
                </Typography>
            </Stack>

            <Divider />

            {/* Sample Items */}
            <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                    {t('samplesTitle')} ({itemCount}/5)
                </Typography>
                <Stack spacing={2}>
                    {items.map((item) => (
                        <SampleBasketItem
                            key={item.sku}
                            item={item}
                            onRemove={handleRemoveItem}
                            patternLabel={tPatterns(item.pattern as string)}
                        />
                    ))}
                </Stack>
            </Stack>

            <Divider />

            {/* Order Form */}
            <Stack spacing={4}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                    {t('deliveryInfo')}
                </Typography>

                <form onSubmit={handleSubmit(submit)} noValidate>
                    <Stack spacing={4}>
                        {/* Customer Info */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                            <Stack flex={1} spacing={3}>
                                <ContactFormTextField
                                    name="name"
                                    control={control}
                                    rules={{
                                        required: tErrors('validation.name.required'),
                                        pattern: {
                                            value: /^[A-Za-z\u0400-\u04FF\s]{2,35}$/,
                                            message: tErrors('validation.name.invalid'),
                                        },
                                    }}
                                    label={tForm('name')}
                                    type="text"
                                    required
                                />

                                <ContactFormTextField
                                    name="company"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^[A-Za-z\u0400-\u04FF\s\d-]{0,35}$/,
                                            message: tErrors('validation.company.invalid'),
                                        },
                                    }}
                                    label={tForm('company')}
                                    type="text"
                                />

                                <ContactFormTextField
                                    name="phonenumber"
                                    control={control}
                                    rules={{
                                        required: tErrors('validation.phone.required'),
                                        pattern: {
                                            value: /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
                                            message: tErrors('validation.phone.invalid'),
                                        },
                                    }}
                                    label={tForm('phone')}
                                    type="text"
                                    required
                                />

                                <ContactFormTextField
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: tErrors('validation.email.required'),
                                        pattern: {
                                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                            message: tErrors('validation.email.invalid'),
                                        },
                                    }}
                                    label={tForm('email')}
                                    type="email"
                                    required
                                />
                            </Stack>

                            {/* Delivery Address */}
                            <Stack flex={1} spacing={3}>
                                <ContactFormTextField
                                    name="deliveryAddress.street"
                                    control={control}
                                    rules={{
                                        required: t('validation.street.required'),
                                        minLength: {
                                            value: 5,
                                            message: t('validation.street.invalid'),
                                        },
                                    }}
                                    label={t('form.street')}
                                    type="text"
                                    required
                                />

                                <ContactFormTextField
                                    name="deliveryAddress.city"
                                    control={control}
                                    rules={{
                                        required: t('validation.city.required'),
                                        pattern: {
                                            value: /^[A-Za-z\u0400-\u04FF\s-]{2,35}$/,
                                            message: t('validation.city.invalid'),
                                        },
                                    }}
                                    label={t('form.city')}
                                    type="text"
                                    required
                                />

                                <ContactFormTextField
                                    name="deliveryAddress.postalCode"
                                    control={control}
                                    rules={{
                                        required: t('validation.postalCode.required'),
                                        pattern: {
                                            value: /^\d{4}$/,
                                            message: t('validation.postalCode.invalid'),
                                        },
                                    }}
                                    label={t('form.postalCode')}
                                    type="text"
                                    required
                                />

                                <ContactFormTextField
                                    name="message"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 400,
                                            message: tErrors('validation.message.tooLong'),
                                        },
                                    }}
                                    label={t('form.notes')}
                                    multiline
                                    minRows={4}
                                    maxRows={4}
                                />
                            </Stack>
                        </Stack>

                        {/* Submit Button */}
                        <Box>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="contained"
                                size="large"
                                sx={{
                                    minWidth: { xs: '100%', sm: 300 },
                                }}
                            >
                                {tButtons('submitButton')}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Stack>
        </Stack>
    );
}
