import 'server-only'
import { ImageTextGrid } from '@/components/ui/grid/ImageTextGrid'
import { Stack } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import React from 'react'

const HomecardsSection = async () => {
    const t = await getTranslations('home.cards')

    const cardsConfig = [
        {
            title: t('premiumOak.title'),
            text: t('premiumOak.text'),
            images: ['no-small1.jpg', 'no-small2.jpg', 'no-large.jpg'] as [string, string, string],
            button1: { text: t('premiumOak.learnMore'), route: "/collections/oak/info" },
            button2: { text: t('premiumOak.viewCollection'), route: "/oak" },
            mirror: true
        },
        {
            title: t('premiumOakCustom.title'),
            text: t('premiumOakCustom.text'),
            images: ['premium-large.jpg', 'premium-small2.jpg', 'premium-small1.jpg'] as [string, string, string],
            button1: { text: t('premiumOakCustom.learnMore'), route: "/collections/custom-oak/info" },
            button2: { text: t('premiumOakCustom.viewCollection'), route: "/custom-oak" },
            mirror: false
        },
        {
            title: t('hybridWood.title'),
            text: t('hybridWood.text'),
            images: ['hw-2.jpg', 'hw-1.jpg', 'hw-3.jpg'] as [string, string, string],
            button1: { text: t('hybridWood.learnMore'), route: "/collections/hybrid-wood/info" },
            button2: { text: t('hybridWood.viewCollection'), route: "/hybrid-wood" },
            mirror: true
        },
        {
            title: t('vinyl.title'),
            text: t('vinyl.text'),
            images: ['vn-large.jpg', 'vn-small2.jpg', 'vn-small1.jpg'] as [string, string, string],
            button1: { text: t('vinyl.learnMore'), route: "/collections/vinyl/info" },
            button2: { text: t('vinyl.viewCollection'), route: "/vinyl" },
            mirror: false
        }
    ];

    return (
        <Stack spacing={{ xs: 6, md: 18 }}>
            {cardsConfig.map((card, index) => (
                <ImageTextGrid
                    key={index}
                    title={card.title}
                    text={card.text}
                    images={card.images}
                    button1={card.button1}
                    button2={card.button2}
                    mirror={card.mirror}
                />
            ))}
        </Stack>
    )
}

export default HomecardsSection