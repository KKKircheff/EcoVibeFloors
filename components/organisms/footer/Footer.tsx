import 'server-only'
import { Box, Stack, Typography } from "@mui/material"
import { footerData } from './footer.data'
import FooterLinkGroup from '@/components/molecules/footer/FooterLinkGroup'
import FooterSocialGroup from '@/components/molecules/footer/FooterSocialGroup'
import { getTranslations, getLocale } from 'next-intl/server'

interface FooterProps {
    locale?: string;
}

const Footer = async ({ locale: localeParam }: FooterProps = {}) => {
    // Use provided locale (for static pages) or get from context (for dynamic pages)
    const locale = localeParam || await getLocale();

    const t = await getTranslations({ locale, namespace: 'footer' })

    return (
        <Box>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent={'space-between'} spacing={4}>
                <FooterLinkGroup groupTitle={t('policies')} group={footerData.policies} />
                <FooterLinkGroup groupTitle={t('resources')} group={footerData.resources} />
                <FooterLinkGroup groupTitle={t('support')} group={footerData.support} />
            </Stack>

            <FooterSocialGroup />

            <Typography variant='body1' pt={6} pb={2} color='info.300' textAlign={'center'}>
                {t('allRightsReserved')} Easy Letters AI  {new Date().getFullYear()}
            </Typography>
        </Box>
    )
}

export default Footer