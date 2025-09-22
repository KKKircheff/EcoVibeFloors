import { Grid, Typography, Box } from '@mui/material';
import Image from 'next/image';

interface ImageTextGridProps {
    text: string;
    images: [string, string, string];
    mirror?: boolean;
}

export function ImageTextGrid({ text, images, mirror = true }: ImageTextGridProps) {
    const [image1, image2, image3] = images;

    const LargeImageSection = (
        <Grid size={{ xs: 12, md: 6 }}>
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
        <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    p: 3,
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'transparent'
                }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {text}
                    </Typography>
                </Box>
                <Grid container spacing={6} display={{ xs: 'none', md: 'flex' }}>
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
        <Box sx={{ py: 4 }}>
            <Grid container spacing={6}>
                {mirror ? (
                    <>
                        {TextAndSmallImagesSection}
                        {LargeImageSection}
                    </>
                ) : (
                    <>
                        {LargeImageSection}
                        {TextAndSmallImagesSection}
                    </>
                )}
            </Grid>
        </Box>
    );
}