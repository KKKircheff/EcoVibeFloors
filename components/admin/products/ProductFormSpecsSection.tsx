'use client';

import {
    Stack,
    TextField,
    Typography,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Control, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ProductFormValues } from './ProductForm';

interface Props {
    control: Control<ProductFormValues>;
}

function SpecField({
    control,
    name,
    label,
}: {
    control: Control<ProductFormValues>;
    name: Parameters<typeof Controller<ProductFormValues>>[0]['name'];
    label: string;
}) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    value={field.value ?? ''}
                    label={label}
                    size="small"
                    fullWidth
                />
            )}
        />
    );
}

export function ProductFormSpecsSection({ control }: Props) {
    const t = useTranslations('admin.form');

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>{t('specifications')}</Typography>
            <Divider />

            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" fontWeight={500}>{t('dimensions')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <SpecField control={control} name="specifications.dimensions.length" label={t('length')} />
                        <SpecField control={control} name="specifications.dimensions.width" label={t('width')} />
                        <SpecField control={control} name="specifications.dimensions.thickness" label={t('thickness')} />
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" fontWeight={500}>{t('appearance')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="row" flexWrap="wrap" gap={2}>
                        <SpecField control={control} name="specifications.appearance.colorCode" label={t('colorCode')} />
                        <SpecField control={control} name="specifications.appearance.gradeCode" label={t('gradeCode')} />
                        <SpecField control={control} name="specifications.appearance.finishCode" label={t('finishCode')} />
                        <SpecField control={control} name="specifications.appearance.structureCode" label={t('structureCode')} />
                        <SpecField control={control} name="specifications.appearance.materialCode" label={t('materialCode')} />
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" fontWeight={500}>{t('installation')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="row" flexWrap="wrap" gap={2}>
                        <SpecField control={control} name="specifications.installation.methodCode" label={t('methodCode')} />
                        <SpecField control={control} name="specifications.installation.vGroove" label={t('vGroove')} />
                        <SpecField control={control} name="specifications.installation.clickSystem" label={t('clickSystem')} />
                        <SpecField control={control} name="specifications.installation.coveragePerPack" label={t('coveragePerPack')} />
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" fontWeight={500}>{t('performance')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="row" flexWrap="wrap" gap={2}>
                        <SpecField control={control} name="specifications.performance.underfloorHeatingCode" label={t('underfloorHeating')} />
                        <SpecField control={control} name="specifications.performance.waterResistanceCode" label={t('waterResistance')} />
                        <SpecField control={control} name="specifications.performance.thermalResistance" label={t('thermalResistance')} />
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" fontWeight={500}>{t('certifications')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="row" flexWrap="wrap" gap={2}>
                        <SpecField control={control} name="specifications.certifications.qualityMark" label={t('qualityMark')} />
                        <SpecField control={control} name="specifications.certifications.countryCode" label={t('country')} />
                        <SpecField control={control} name="specifications.certifications.emissions" label={t('emissions')} />
                        <SpecField control={control} name="specifications.certifications.environmental" label={t('environmental')} />
                        <SpecField control={control} name="specifications.certifications.safety" label={t('safety')} />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}
