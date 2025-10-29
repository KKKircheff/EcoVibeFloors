import 'server-only';
import { Stack, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import sustainableImage from '../../../../public/images/other/sustainable.webp'
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function OakSustainability() {
    const t = await getTranslations('oakFlooring.sustainability');

    const points = [
        t('points.dutchCraftsmanship'),
        t('points.sustainableSourcing'),
        t('points.lowVOC'),
        t('points.longevity')
    ];

    return (
        <Container maxWidth="xl">
            <Stack spacing={6}>
                <Stack spacing={2} textAlign="center">
                    <BlogTitle>{t('title')}</BlogTitle>
                    <BlogSubtitle>{t('subtitle')}</BlogSubtitle>
                    <BlogContent>{t('content')}</BlogContent>
                </Stack>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    alignItems="center"
                >
                    <Stack flex={1} spacing={2}>
                        <List>
                            {points.map((point, index) => (
                                <ListItem key={index} sx={{ py: 1 }}>
                                    <ListItemIcon>
                                        <FaCheck color="#2E7D32" size={20} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={point}
                                        primaryTypographyProps={{
                                            fontSize: { xs: '1rem', md: '1.1rem' }
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Stack>

                    <Stack flex={1}>
                        <Image
                            src={sustainableImage}
                            alt="Sustainable oak flooring"
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: '8px'
                            }}
                            sizes="(min-width: 900px) 50vw, 100vw"
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
