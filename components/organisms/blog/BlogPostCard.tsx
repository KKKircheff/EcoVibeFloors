'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Stack, Typography, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from '@/i18n/navigation';
import { BlogCategoryBadge } from '@/components/atoms/blog/BlogCategoryBadge';
import { BlogPost } from '@/lib/types/blog';
import { borderRadius } from '@/lib/styles/borderRadius';

interface BlogPostCardProps {
    post: BlogPost;
    locale: 'bg' | 'en';
}

function getFirebaseStorageUrl(path: string): string {
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'ecovibe-floors.firebasestorage.app';
    const encodedPath = encodeURIComponent(path);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
}

function formatDate(timestamp: unknown, locale: string): string {
    if (!timestamp) return '';
    const date = typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp
        ? (timestamp as { toDate: () => Date }).toDate()
        : new Date(timestamp as string);

    return date.toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const translation = post.translations[locale];
    if (!translation) return null;

    const imageUrl = getFirebaseStorageUrl(post.heroImage);
    const formattedDate = formatDate(translation.datePublished || post.datePublished, locale);

    const handleClick = () => {
        router.push(`/blog/${post.slug}`);
    };

    return (
        <Box
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                cursor: 'pointer',
                borderRadius: borderRadius.md,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                boxShadow: isHovered ? '0 4px 20px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
            }}
        >
            {/* Image section */}
            <Box
                sx={{
                    position: 'relative',
                    flex: { xs: 'none', md: '0 0 42%' },
                    width: { xs: '100%', md: 'auto' },
                    paddingBottom: { xs: '60%', md: 0 },
                    overflow: 'hidden',
                    minHeight: { md: 240 },
                }}
            >
                <Image
                    src={imageUrl}
                    alt={translation.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 42vw"
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    style={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out',
                        transform: isHovered ? 'scale(105%)' : 'scale(100%)',
                        opacity: imageLoaded ? 1 : 0,
                    }}
                />
                {/* Category badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: { xs: 12, md: 16 },
                        left: { xs: 12, md: 16 },
                    }}
                >
                    <BlogCategoryBadge category={post.category} />
                </Box>
            </Box>

            {/* Content section */}
            <Stack
                sx={{
                    flex: 1,
                    p: { xs: 2.5, md: 3.5 },
                    justifyContent: 'center',
                    gap: 1.5,
                }}
            >
                <Typography
                    variant="h5"
                    component="h3"
                    color="info.500"
                    fontWeight={500}
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3,
                    }}
                >
                    {translation.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 2, md: 3 },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                    }}
                >
                    {translation.metaDescription}
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 'auto', pt: 1 }}
                >
                    <Typography variant="caption" color="info.400">
                        {formattedDate}
                    </Typography>
                    <Typography variant="caption" color="info.400">
                        &middot;
                    </Typography>
                    <Typography variant="caption" color="info.400">
                        {translation.readingTimeMinutes || 5} min
                    </Typography>

                    {/* Arrow link — visible on hover for desktop, always on mobile */}
                    <Box
                        sx={{
                            ml: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'primary.main',
                            opacity: { xs: 1, md: isHovered ? 1 : 0.5 },
                            transition: 'opacity 0.2s',
                        }}
                    >
                        <Typography variant="caption" fontWeight={500}>
                            {locale === 'bg' ? 'Прочети' : 'Read'}
                        </Typography>
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}