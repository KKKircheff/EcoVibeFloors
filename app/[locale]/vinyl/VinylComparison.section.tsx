import 'server-only';
import {
    Stack,
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Chip
} from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function VinylComparison() {
    const t = await getTranslations('vinyl');

    const comparisonData = [
        {
            feature: 'thickness',
            tileVinyl: '2.0-3.0mm',
            herringboneVinyl: '2.0-3.5mm',
            natureRigid: '4.0-5.0mm',
            villageVinyl: '2.5-3.5mm',
            forestVinyl: '3.0-4.0mm'
        },
        {
            feature: 'plankSize',
            tileVinyl: '121.9×60.9cm',
            herringboneVinyl: '12×60cm / 91.4×15.2cm',
            natureRigid: '22.8×121-183cm',
            villageVinyl: '121.9×22.86cm',
            forestVinyl: '151.6×24.1cm'
        },
        {
            feature: 'installation',
            tileVinyl: 'Glue-down',
            herringboneVinyl: 'Click / Glue-down',
            natureRigid: 'Click (floating)',
            villageVinyl: 'Glue-down',
            forestVinyl: 'Glue-down'
        },
        {
            feature: 'usageClass',
            tileVinyl: '23/33/42',
            herringboneVinyl: '33/42',
            natureRigid: '23/33',
            villageVinyl: '23/33/42',
            forestVinyl: '23/33/42'
        },
        {
            feature: 'priceRange',
            tileVinyl: '€39.95/m²',
            herringboneVinyl: '€30-45/m²',
            natureRigid: '€35-50/m²',
            villageVinyl: '€25-40/m²',
            forestVinyl: '€30-45/m²'
        }
    ];

    const collections = ['tileVinyl', 'herringboneVinyl', 'natureRigid', 'villageVinyl', 'forestVinyl'];

    return (
        <Container maxWidth="lg">
            <Stack spacing={6}>
                <Stack spacing={2} textAlign="center">
                    <Typography variant="h3" color="primary.main" fontWeight={600}>
                        {t('comparison.title')}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="700px" mx="auto">
                        {t('comparison.subtitle')}
                    </Typography>
                </Stack>

                <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>
                                    {t('comparison.feature')}
                                </TableCell>
                                {collections.map((collection) => (
                                    <TableCell
                                        key={collection}
                                        sx={{ color: 'primary.contrastText', fontWeight: 600, textAlign: 'center' }}
                                    >
                                        {t(`collections.${collection}.name`)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {comparisonData.map((row, index) => (
                                <TableRow
                                    key={row.feature}
                                    sx={{
                                        '&:nth-of-type(odd)': { bgcolor: 'grey.50' },
                                        '&:hover': { bgcolor: 'grey.100' }
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 500, color: 'primary.main' }}>
                                        {t(`comparison.features.${row.feature}`)}
                                    </TableCell>
                                    {collections.map((collection) => (
                                        <TableCell key={collection} sx={{ textAlign: 'center' }}>
                                            {row.feature === 'usageClass' ? (
                                                <Chip
                                                    label={row[collection as keyof typeof row]}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Typography variant="body2">
                                                    {row[collection as keyof typeof row]}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                        {t('comparison.note')}
                    </Typography>
                </Box>
            </Stack>
        </Container>
    );
}