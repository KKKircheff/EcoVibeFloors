'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Stack, Box, Skeleton } from '@mui/material';
import ImageModal from '@/components/products/image-modal/ImageModal.component';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isMainImageLoading, setIsMainImageLoading] = useState(true);
    const [loadedThumbnails, setLoadedThumbnails] = useState<Set<number>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMainImageLoad = () => {
        setIsMainImageLoading(false);
    };

    const handleThumbnailLoad = (index: number) => {
        setLoadedThumbnails(prev => new Set(prev).add(index));
    };

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsMainImageLoading(true);
    };

    const handleMainImageClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Stack spacing={2}>
                {/* Main Image */}
                <Box
                    onClick={handleMainImageClick}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '4/3',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.95,
                        },
                    }}
                >
                    {/* Skeleton overlay */}
                    {isMainImageLoading && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            animation="wave"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 1,
                            }}
                        />
                    )}

                    <Image
                        src={images[selectedImageIndex]}
                        alt={`${productName} - Image ${selectedImageIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        loading="lazy"
                        onLoad={handleMainImageLoad}
                        style={{
                            objectFit: 'cover',
                            opacity: isMainImageLoading ? 0 : 1,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    />
                </Box>

                {/* Thumbnail Images */}
                <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                        overflowX: 'auto',
                        overflowY: 'visible',
                        pb: 1,
                        pt: 0.5,
                        '&::-webkit-scrollbar': {
                            height: 8,
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'grey.200',
                            borderRadius: 1,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'primary.main',
                            borderRadius: 1,
                        },
                    }}
                >
                    {images.map((image, index) => (
                        <Box
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            sx={{
                                position: 'relative',
                                minWidth: 80,
                                height: 80,
                                borderRadius: 2,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: selectedImageIndex === index ? 3 : 2,
                                borderColor: selectedImageIndex === index ? 'primary.main' : 'grey.300',
                                borderWidth: '1px',
                                transition: 'all 0.2s ease',
                                zIndex: 1,
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    zIndex: '10 !important',
                                },
                            }}
                        >
                            {/* Thumbnail skeleton */}
                            {!loadedThumbnails.has(index) && (
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height="100%"
                                    animation="wave"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        zIndex: 1,
                                    }}
                                />
                            )}

                            <Image
                                src={image}
                                alt={`${productName} - Thumbnail ${index + 1}`}
                                fill
                                sizes="80px"
                                loading="lazy"
                                onLoad={() => handleThumbnailLoad(index)}
                                style={{
                                    objectFit: 'cover',
                                    opacity: loadedThumbnails.has(index) ? 1 : 0,
                                    transition: 'opacity 0.3s ease-in-out, transform 0.2s ease',
                                }}
                            />
                        </Box>
                    ))}
                </Stack>
            </Stack>

            {/* Image Modal */}
            <ImageModal
                open={isModalOpen}
                onClose={handleModalClose}
                images={images}
                initialIndex={selectedImageIndex}
                productName={productName}
            />
        </>
    );
}
