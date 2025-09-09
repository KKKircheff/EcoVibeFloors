import 'server-only'
import { Box, Grid, Stack, Typography } from "@mui/material"
import { footerData } from './footer.data'
import FooterLinkGroup from "./footer-link-group/FooterLinkGroup.component"
import FooterSocialGroup from "./footer-social-group/FooterSocialGroup.component"
import { getTranslations } from 'next-intl/server'

const Footer = async () => {

    const t = await getTranslations('footer')

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