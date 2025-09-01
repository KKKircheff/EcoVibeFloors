

import { ListItem, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Messages } from '@/global';
import { NavRoute } from '@/i18n/routing';

type ItemProps = {
    route: NavRoute,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ListMenuItem = ({ route, setIsDrawerOpen }: ItemProps) => {

    const t = useTranslations("NavbarLinks");

    const handleClick = () => {
        setIsDrawerOpen(false);
    }

    return (
        <ListItem onClick={handleClick} sx={{ paddingX: 0 }} >
            <Link href={route.path} key={route.path} style={{ textDecoration: 'none' }} aria-label={t(`${route.name.replace(' ', '_')}` as keyof Messages['NavbarLinks'])}>
                <Typography variant='body2' >
                    {t(`${route.name.replace(' ', '_')}` as keyof Messages['NavbarLinks'])}
                </Typography>
            </Link>
        </ListItem >
    )
}

export default ListMenuItem

