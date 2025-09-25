import { Stack, Typography } from '@mui/material';
import Image from 'next/image';

export interface FeatureCardProps {
    image?: string;
    title: string;
    description: string;
    imageWidth?: number;
    imageHeight?: number;
}

export function FeatureImageCard({
    image,
    title,
    description,
    imageWidth = 130,
    imageHeight = 60
}: FeatureCardProps) {
    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            {image && (
                <Image
                    src={image}
                    alt={title}
                    width={imageWidth}
                    height={imageHeight}
                    style={{ marginBottom: 16 }}
                />
            )}
            <Typography variant="h2" component="h3" gutterBottom textAlign={'center'}>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign={'center'}>
                {description}
            </Typography>
        </Stack>
    );
}