import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Grid } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Messages } from '@/global';

export async function HomeFAQ() {
    const t = await getTranslations('home.faq');

    // FAQ questions configuration
    const faqKeys: (keyof Messages['home']['faq']['questions'])[] = [
        'hybridVsOakParquet',
        'dutchGermanQuality',
        'woodInKitchenBathroom',
        'differenceSpcLvt',
        'underfloorHeatingCompatibility',
        'solidVsEngineered',
        'installationDifficulty',
        'safetyCertifications',
        'warrantyMeaning',
        'deliveryTerms'
    ];

    // Generate Schema.org FAQPage structured data
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqKeys.map((key) => ({
            '@type': 'Question',
            name: t(`questions.${key}.question`),
            acceptedAnswer: {
                '@type': 'Answer',
                text: t(`questions.${key}.answer`)
            }
        }))
    };

    return (
        <>
            {/* Schema.org JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <Stack
                component="section"
                spacing={{ xs: 4, md: 6 }}
                sx={{
                    // maxWidth: '1400px',
                    mx: 'auto',
                    width: '100%'
                }}
            >
                {/* Section Header */}
                <Box mb={{ xs: 2, md: 4 }}>
                    <Typography
                        variant="h2"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                            fontWeight: 500,
                            color: 'text.primary',
                            mb: 2
                        }}
                    >
                        {t('sectionTitle')}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: '0.938rem', md: '1rem' },
                            maxWidth: '900px',
                            lineHeight: 1.6
                        }}
                    >
                        {t('sectionSubtitle')}
                    </Typography>
                </Box>

                {/* FAQ Accordion Items in Two Column Grid */}
                <Grid container spacing={2}>
                    {faqKeys.map((key, index) => (
                        <Grid key={key} size={{ xs: 12, md: 6 }}>
                            <Accordion
                                elevation={0}
                                disableGutters
                                sx={{
                                    bgcolor: 'transparent',
                                    '&:before': {
                                        display: 'none'
                                    },
                                    '&.Mui-expanded': {
                                        margin: 0
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <ChevronRightIcon
                                            sx={{
                                                color: 'info.50',
                                                transition: 'transform 0.3s'
                                            }}
                                        />
                                    }
                                    aria-controls={`faq-${index}-content`}
                                    id={`faq-${index}-header`}
                                    sx={{
                                        bgcolor: 'primary.500',
                                        color: 'primary.contrastText',
                                        px: 3,
                                        py: 2,
                                        minHeight: 'auto',
                                        borderRadius: 0,
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: 'primary.600',
                                            color: 'primary.contrastText',
                                        },
                                        '&.Mui-expanded': {
                                            minHeight: 'auto',
                                            bgcolor: 'primary.600',
                                            color: 'primary.contrastText',
                                        },
                                        '& .MuiAccordionSummary-content': {
                                            my: 0,
                                            '&.Mui-expanded': {
                                                my: 0
                                            }
                                        },
                                        '& .MuiAccordionSummary-expandIconWrapper': {
                                            color: 'primary.contrastText',
                                            '&.Mui-expanded': {
                                                transform: 'rotate(90deg)'
                                            }
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'inherit'
                                        }}
                                    >
                                        {t(`questions.${key}.question`)}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        bgcolor: 'white',
                                        px: 3,
                                        py: 3,
                                        borderLeft: '1px solid',
                                        borderRight: '1px solid',
                                        borderBottom: '1px solid',
                                        borderColor: 'primary.100',
                                        borderBottomLeftRadius: 2,
                                        borderBottomRightRadius: 2
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        color="info.400"

                                    >
                                        {t(`questions.${key}.answer`)}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </>
    );
}
