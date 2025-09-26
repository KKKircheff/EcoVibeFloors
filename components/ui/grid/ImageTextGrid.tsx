import { Grid, Typography, Box, Stack } from '@mui/material';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import GrayActionButton from '@/components/ui/buttons/GrayActionButton';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';
import { caveat } from '@/lib/styles/theme';

interface ImageTextGridProps {
    title: string;
    text: string;
    images: [string, string, string];
    button1: { text: string; route: string };
    button2: { text: string; route: string };
    mirror?: boolean;
}

export function ImageTextGrid({ title, text, images, button1, button2, mirror = true }: ImageTextGridProps) {
    const [image1, image2, image3] = images;

    const LargeImageSection = (
        <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: mirror ? 2 : 1 }}>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
                <Image
                    src={`/images/home-page/${mirror ? image3 : image1}`}
                    alt="Large featured image"
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </Box>
        </Grid>
    );

    const TextAndSmallImagesSection = (
        <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: mirror ? 1 : 2 }} >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        backgroundColor: 'info.50',
                        padding: { xs: 2.5, md: 4 },
                        py: 3,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Stack
                        justifyContent="space-between"
                        spacing={2}

                        sx={{ p: 0, flex: 1 }}
                    >
                        <Typography variant="h1" component="h2" fontFamily={caveat.style.fontFamily} color='info.500'>
                            {title}
                        </Typography>
                        <Stack justifyContent="center" sx={{ flex: 1 }} >
                            <Typography variant="body1" sx={{ lineHeight: 1.6 }} pb={2}>
                                {text}
                            </Typography>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, md: 3 }} py={{ xs: 1, md: 1 }}>
                            <Link href={button1.route} style={{ textDecoration: 'none', flex: 1 }}>
                                <GrayActionButton sx={{ width: '100%' }}>
                                    {button1.text}
                                </GrayActionButton>
                            </Link>

                            <Link href={button2.route} style={{ textDecoration: 'none', flex: 1 }}>
                                <PrimaryActionButton sx={{ width: '100%' }}>
                                    {button2.text}
                                </PrimaryActionButton>
                            </Link>

                        </Stack>
                    </Stack>
                </Box>

                <Grid container spacing={3} display={{ xs: 'none', md: 'flex' }} sx={{ mt: 3 }}>
                    <Grid size={6}>
                        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
                            <Image
                                src={`/images/home-page/${mirror ? image1 : image2}`}
                                alt="Small image 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>
                    </Grid>
                    <Grid size={6}>
                        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
                            <Image
                                src={`/images/home-page/${mirror ? image2 : image3}`}
                                alt="Small image 2"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );

    return (
        <Grid container spacing={3} py={{ xs: 1, md: 6 }}>
            {LargeImageSection}
            {TextAndSmallImagesSection}
        </Grid>
    );
}