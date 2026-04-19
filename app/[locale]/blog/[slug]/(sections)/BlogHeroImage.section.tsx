import 'server-only';
import { Box, Chip, Stack } from '@mui/material';
import Image from 'next/image';

interface BlogHeroImageProps {
    src: string;
    alt: string;
    tags?: string[];
}

export function BlogHeroImage({ src, alt, tags }: BlogHeroImageProps) {
    return (
        <Box
            position="relative"
            width="100%"
            sx={{
                height: { xs: 220, sm: 300, lg: 540 },
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <Image
                src={src}
                alt={alt}
                fill
                priority
                sizes="(min-width: 900px) 65vw, 100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
            />

            {/* Dark gradient for tag readability */}
            {tags && tags.length > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)',
                    }}
                />
            )}

            {/* Tags overlaid at bottom-left */}
            {tags && tags.length > 0 && (
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={0.75}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                    }}
                >
                    {tags.slice(0, 5).map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(6px)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.35)',
                                fontWeight: 500,
                                fontSize: '0.7rem',
                            }}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
}
