'use client';

import { Breadcrumbs, Link, Typography, Stack } from '@mui/material';
import { useRouter } from '@/i18n/navigation';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        event.preventDefault();
        router.push(href);
    };

    return (
        <Stack sx={{ pb: { xs: 2, md: 6 } }}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-separator': {
                        mx: 1,
                    },
                }}
            >
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    if (isLast || !item.href) {
                        return (
                            <Typography
                                key={index}
                                color="info.500"
                                fontWeight={500}
                                variant='body1'
                            >
                                {item.label}
                            </Typography>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={item.href}
                            onClick={(e) => handleClick(e, item.href!)}
                            underline="hover"
                            color="text.secondary"
                            fontSize={{ xs: '0.875rem', sm: '1rem' }}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    color: 'primary.main',
                                },
                                transition: 'color 0.2s ease',
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </Stack>
    );
}
