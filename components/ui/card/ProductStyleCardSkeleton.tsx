'use client';

import React from 'react';
import { Stack, Box, Skeleton, keyframes, Typography } from '@mui/material';
import { borderRadius } from '@/lib/styles/borderRadius';

const pulse = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(0.95);
  }
`;

export function ProductStyleCardSkeleton() {
    return (
        <Stack spacing={1} sx={{ height: '100%' }}>
            <Stack
                borderRadius={borderRadius.sm}
                sx={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '66.67%', // 3:2 aspect ratio for style cards
                    backgroundColor: 'grey.100',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                >
                    <Typography variant='h2' color='primary.600' fontFamily={'Caveat'}>EcoVibe floors</Typography>
                </Box>
            </Stack>

            <Stack spacing={1} sx={{ flexGrow: 1, p: 2 }}>
                <Skeleton variant="text" width="70%" height={28} />
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
            </Stack>
        </Stack>
    );
}
