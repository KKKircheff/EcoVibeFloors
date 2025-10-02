import { Stack, Typography, Grid } from '@mui/material';

import { CollectionCard } from '@/components/features/products';
import { getAllCollections } from '@/utils/products';
import { getProductCountByCollection } from '@/utils/products';

interface CollectionsGridProps {
    title: string;
}

export function CollectionsGrid({ title }: CollectionsGridProps) {
    const collections = getAllCollections();

    return (
        <Stack spacing={6}>
            <Typography variant="h2" textAlign="center" color="primary.main">
                {title}
            </Typography>

            <Grid container spacing={{ xs: 3, md: 4 }}>
                {collections.map((collection) => {
                    const productCount = getProductCountByCollection(collection.id);

                    return (
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={collection.id}>
                            <CollectionCard
                                collectionId={collection.id}
                                nameKey={collection.nameKey}
                                descriptionKey={collection.descriptionKey}
                                heroImage={collection.heroImage}
                                productCount={productCount}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Stack>
    );
}
