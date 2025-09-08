'use client'
import { useRouter } from "@/i18n/navigation";
import { Grid, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";


export type FooterLinkKeys = Exclude<
    keyof IntlMessages['footer']['links'],
    'label'
>;

type Props = {
    groupTitle: string;
    group: {
        title: keyof IntlMessages['footer']['links'];
        link: string;
    }[];
};

const FooterLinkGroup = ({ groupTitle, group }: Props) => {
    const router = useRouter();
    const t = useTranslations('footer.links');

    const handleClick = (route: string) => {
        router.push(`/${route}`);
    }

    return (
        <Stack direction='column' textAlign='left'>
            <Typography
                variant='body2'
                pb={1}
                color='info.50'
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
                    color='info.300'
                    fontWeight='500'
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleClick(row.link)}
                >
                    {t(row.title)}
                </Typography>
            })}
        </Stack>
    )
}

export default FooterLinkGroup