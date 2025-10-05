import { Stack, Typography, Grid } from '@mui/material';

import { getAllCollections } from '@/utils/products';
import { getProductCountByCollection } from '@/utils/products';
import { CollectionCard } from '@/components/features/products/CollectionCard';
import { getCollectionCardImages } from '@/lib/utils/getCollectionCardImages';

interface CollectionsGridProps {
    title: string;
}

export function CollectionsGrid({ title }: CollectionsGridProps) {
    const collections = getAllCollections();

    return (
        <Stack spacing={6}
            bgcolor={{ xs: 'grey.50', md: "info.50" }}
            mx={0}
            px={{ xs: 0, md: 6 }}
            pb={{ xs: 8, md: 12 }}
            pt={{ xs: 6, md: 12 }}
        >
            <Typography variant="h2" fontWeight={600} textAlign={'center'} pb={3}>
                {title}
            </Typography>

            <Grid container spacing={{ xs: 3, md: 4 }}>
                {collections.map((collection) => {
                    const productCount = getProductCountByCollection(collection.id);

                    // Get collection card images if configured
                    let mainImage: string | undefined;
                    let hoverImage: string | undefined;

                    if (collection.cardImages) {
                        const images = getCollectionCardImages(
                            collection.id,
                            collection.cardImages.main,
                            collection.cardImages.hover
                        );
                        mainImage = images.mainImage;
                        hoverImage = images.hoverImage;
                    }

                    return (
                        <Grid size={{ xs: 12, lg: 6 }} key={collection.id}>
                            <CollectionCard
                                collectionId={collection.id}
                                nameKey={collection.nameKey}
                                descriptionKey={collection.descriptionKey}
                                mainImage={mainImage}
                                hoverImage={hoverImage}
                                productCount={productCount}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Stack>
    );
}
