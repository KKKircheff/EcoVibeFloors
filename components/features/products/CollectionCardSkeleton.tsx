import React from 'react';
import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export function CollectionCardSkeleton() {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Image skeleton */}
            <Skeleton
                variant="rectangular"
                height={240}
                sx={{
                    width: '100%',
                }}
            />

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Stack spacing={2}>
                    {/* Description skeleton */}
                    <Skeleton variant="text" width="100%" height={60} />

                    {/* Title skeleton */}
                    <Skeleton variant="text" width="70%" height={40} />

                    {/* Product count skeleton */}
                    <Skeleton variant="text" width="40%" height={24} />

                    {/* Button skeleton */}
                    <Skeleton variant="rectangular" width="100%" height={42} sx={{ borderRadius: 1 }} />
                </Stack>
            </CardContent>
        </Card>
    );
}
