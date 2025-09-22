import Quote from '@/components/ui/typography/Quote'
import { Stack, StackProps } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import React from 'react'


const QuotesSection = async ({ ...otherProps }: StackProps) => {
    const t = await getTranslations('home.quotes')

    return (
        <Stack
            width={'100%'}
            py={{ xs: 8, md: 16 }}
            spacing={{ xs: 8, md: 16 }}
            {...otherProps}
            sx={
                { ...otherProps.sx }
            }
        >
            <Quote quote={t('beautiful_floor')} />
            <Quote quote={t('energizing_feeling')} size='2/3' alignSelf={'flex-end'} />
        </Stack>
    )
}

export default QuotesSection