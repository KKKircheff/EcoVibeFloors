import React from 'react';
import { Grid, Typography, Stack } from '@mui/material';
import { OakTreatment } from '@/types/treatments';
import { TreatmentCard } from '../card/TreatmentCard';

export interface TreatmentGridProps {
    treatments: OakTreatment[];
    emptyMessage?: string;
}

export function TreatmentGrid({ treatments, emptyMessage }: TreatmentGridProps) {
    if (treatments.length === 0) {
        return (
            <Stack alignItems="center" justifyContent="center" py={8}>
                <Typography variant="h5" color="text.secondary">
                    {emptyMessage || 'No treatments found'}
                </Typography>
            </Stack>
        );
    }

    return (
        <Grid container spacing={{ xs: 2, md: 3, xl: 4 }}>
            {treatments.map((treatment) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={treatment.slug}>
                    <TreatmentCard treatment={treatment} />
                </Grid>
            ))}
        </Grid>
    );
}
