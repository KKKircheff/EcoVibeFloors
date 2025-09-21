

import { ListItem, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Messages } from '@/global';
import { NavRoute } from '@/i18n/routing';

type ItemProps = {
    route: NavRoute,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isScrolled?: boolean
}

const ListMenuItem = ({ route, setIsDrawerOpen, isScrolled = true }: ItemProps) => {

    const t = useTranslations("navigation");

    const handleClick = () => {
        setIsDrawerOpen(false);
    }

    return (
        <ListItem onClick={handleClick} sx={{ paddingX: 0 }} >
            <Link href={route.path} key={route.path} style={{ textDecoration: 'none' }} aria-label={t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}>
                <Typography
                    variant='subtitle2'
                    color={isScrolled ? 'text.primary' : 'white'}
                    // fontWeight={500}
                    sx={{
                        '&:hover': {
                            color: isScrolled ? 'primary.700' : 'rgba(255, 255, 255, 0.8)'
                        },
                        transition: 'color 0.3s ease-in-out'
                    }}
                >
                    {t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}
                </Typography>
            </Link>
        </ListItem >
    )
}

export default ListMenuItem

