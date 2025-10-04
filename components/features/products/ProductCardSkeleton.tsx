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

export function ProductCardSkeleton() {
    return (
        <Stack spacing={1} sx={{ height: '100%' }}>
            <Stack
                borderRadius={borderRadius.sm}
                sx={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '150%',
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
                        left: 'center',
                        transform: 'translate(-50%, -50%)',
                        animation: `${pulse} 2s ease-in-out infinite`,
                        // width: '60px',
                        // height: '60px',
                    }}
                >
                    <Typography variant='h2' color='primary.600' fontFamily={'Caveat'}>EcoVibe floors</Typography>
                    {/* <Image
                        src={logoIcon}
                        alt="Loading..."
                        width={60}
                        height={60}
                        style={{ opacity: 0.3 }}
                    /> */}
                </Box>
            </Stack>

            <Stack spacing={1} sx={{ flexGrow: 1, p: 2 }}>
                <Skeleton variant="text" width="80%" height={32} />
                <Stack direction="column" spacing={1}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={24} />
                </Stack>
            </Stack>
        </Stack>
    );
}
