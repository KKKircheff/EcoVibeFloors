import React from 'react';
import { Card, CardContent, Skeleton, Stack, Box } from '@mui/material';

export function TreatmentCardSkeleton() {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Image skeleton - 1:1 aspect ratio */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '100%',
                }}
            >
                <Skeleton
                    variant="rectangular"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                    {/* Title skeleton */}
                    <Skeleton variant="text" width="80%" height={32} />

                    {/* Finish type skeleton */}
                    <Skeleton variant="text" width="60%" height={24} />
                </Stack>
            </CardContent>
        </Card>
    );
}
