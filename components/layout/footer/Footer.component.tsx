import { Grid, Typography } from "@mui/material"
import { footerData } from './footer.data'
import FooterLinkGroup from "./footer-link-group/FooterLinkGroup.component"
import FooterSocialGroup from "./footer-social-group/FooterSocialGroup.component"
import { getTranslations } from "next-intl/server"

const Footer = async () => {

    const t = await getTranslations('Footer')

    return (
        <>
            <Grid container columns={12} spacing={3}>
                <FooterLinkGroup groupTitle={t('policies')} group={footerData.policies} />
                <FooterLinkGroup groupTitle={t('resources')} group={footerData.resources} />
                <FooterLinkGroup groupTitle={t('userShortcuts')} group={footerData.shortcuts} />
                <FooterLinkGroup groupTitle={t('support')} group={footerData.support} />
            </Grid>

            <FooterSocialGroup />

            <Typography variant='body1' pt={6} pb={2} color='neutral.300' textAlign={'center'}>
                {t('allRightsReserved')} Easy Letters AI  {new Date().getFullYear()}
            </Typography>
        </>
    )
}

export default Footer