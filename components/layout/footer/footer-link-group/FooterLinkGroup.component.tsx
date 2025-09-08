'use client'
import { useRouter } from "@/utils/next-intl/routing";
import { Grid, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";


export type FooterLinkKeys = Exclude<
    keyof IntlMessages['Footer']['links'],
    'label'
>;

type Props = {
    groupTitle: string;
    group: {
        title: keyof IntlMessages['Footer']['links'];
        link: string;
    }[];
};

const FooterLinkGroup = ({ groupTitle, group }: Props) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_ADDRESS;
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations('Footer.links');

    const handleClick = (route: string) => {
        console.log('url:', `${baseUrl}/${locale}${route}`);
        router.push(`${baseUrl}/${locale}${route}`);
    }

    return (
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Stack direction='column' textAlign='left'>
                <Typography
                    variant='body2'
                    pb={1}
                    color='neutral.50'
                    fontWeight='500'
                    sx={{ cursor: 'default' }}
                >
                    {groupTitle}
                </Typography>

                {group.map((row, index) => {
                    return <Typography
                        key={index}
                        py={.3}
                        variant='body2'
                        color='neutral.300'
                        fontWeight='500'
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleClick(row.link)}
                    >
                        {t(row.title)}
                    </Typography>
                })}
            </Stack>
        </Grid>
    )
}

export default FooterLinkGroup