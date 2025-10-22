import 'server-only';
import { Stack, Typography, Box } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';

export async function OakCTA() {
    const t = await getTranslations('oak.cta');

    return (
        <Box
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: { xs: 8, md: 12 },
                px: { xs: 3, md: 6 },
                borderRadius: 4,
                textAlign: 'center'
            }}
        >
            <Stack spacing={4} alignItems="center">
                <Typography variant="h2" fontWeight={600} color="inherit">
                    {t('title')}
                </Typography>
                <Typography variant="h6" color="inherit" maxWidth="800px" sx={{ opacity: 0.95 }}>
                    {t('description')}
                </Typography>
                <PrimaryActionButton
                    href="/contact"
                    variant="contained"
                    sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': {
                            bgcolor: 'grey.100'
                        }
                    }}
                >
                    {t('contact')}
                </PrimaryActionButton>
            </Stack>
        </Box>
    );
}
