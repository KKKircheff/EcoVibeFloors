'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Modal, Box, IconButton, Typography, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ImageModalProps {
    open: boolean;
    onClose: () => void;
    images: string[];
    initialIndex: number;
    productName: string;
}

export default function ImageModal({
    open,
    onClose,
    images,
    initialIndex,
    productName,
}: ImageModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isImageLoading, setIsImageLoading] = useState(true);

    // Update current index when initial index changes
    useEffect(() => {
        setCurrentIndex(initialIndex);
        setIsImageLoading(true);
    }, [initialIndex]);

    // Disable background scroll when modal is open
    useEffect(() => {
        if (open) {
            // Save original overflow values
            const originalBodyOverflow = document.body.style.overflow;
            const originalHtmlOverflow = document.documentElement.style.overflow;

            // Disable scroll on both html and body
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            return () => {
                // Restore original values
                document.body.style.overflow = originalBodyOverflow;
                document.documentElement.style.overflow = originalHtmlOverflow;
            };
        }
    }, [open]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!open) return;

            switch (event.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    handlePrevious();
                    break;
                case 'ArrowRight':
                    handleNext();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, currentIndex, images.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsImageLoading(true);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsImageLoading(true);
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            disableScrollLock={false}
            keepMounted={false}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                }}
                onClick={onClose}
            >
                {/* Close Button */}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: { xs: 16, md: 32 },
                        right: { xs: 16, md: 32 },
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 2,
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Previous Button */}
                {images.length > 1 && (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrevious();
                        }}
                        sx={{
                            position: 'absolute',
                            left: { xs: 8, md: 32 },
                            color: 'white',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 2,
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        <ChevronLeftIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
                    </IconButton>
                )}

                {/* Next Button */}
                {images.length > 1 && (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        sx={{
                            position: 'absolute',
                            right: { xs: 8, md: 32 },
                            color: 'white',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 2,
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        <ChevronRightIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
                    </IconButton>
                )}

                {/* Image Container */}
                <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                        position: 'relative',
                        width: '90vw',
                        height: '90vh',
                        cursor: 'default',
                    }}
                >
                    {/* Loading Skeleton */}
                    {isImageLoading && (
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                            }}
                            animation="wave"
                        />
                    )}

                    {/* Main Image */}
                    <Image
                        src={images[currentIndex]}
                        alt={`${productName} - Image ${currentIndex + 1}`}
                        fill
                        sizes="90vw"
                        priority
                        onLoad={handleImageLoad}
                        style={{
                            objectFit: 'contain',
                            opacity: isImageLoading ? 0 : 1,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    />
                </Box>

                {/* Image Counter */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: { xs: 16, md: 32 },
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        zIndex: 2,
                    }}
                >
                    <Typography variant="body2">
                        Image {currentIndex + 1} of {images.length}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
}
