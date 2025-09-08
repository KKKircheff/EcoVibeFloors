'use client'
import IconLink from '@/components/navigation/IconLink.component';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

const FooterSocialGroup = () => {
    const t = useTranslations('Footer.social');

    return (
        <Stack direction='row' spacing={{ xs: 1, sm: 3 }} pt={10} alignItems='center'>
            <Typography
                variant='body2'
                color='neutral.50'
                textAlign='left'
                fontWeight='500'>
                {t('followUs')}
            </Typography>
            <Stack direction='row' spacing={3}>
                <IconLink iconUrl='/icons/icon_instagram.webp' link='' />
                <IconLink iconUrl='/icons/icon_facebook.webp' link='https://www.facebook.com/profile.php?id=61575057606918' />
                <IconLink iconUrl='/icons/icon_linkedin.webp' link='https://www.linkedin.com/company/easyletters' />
            </Stack>
        </Stack>
    );
}

export default FooterSocialGroup;