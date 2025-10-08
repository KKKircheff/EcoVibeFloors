import { Stack, Grid } from '@mui/material';

import { getAllCollections } from '@/utils/products';
import { getProductCountByCollection } from '@/utils/products';
import { CollectionCard } from '@/components/ui/card/CollectionCard';
import { getCollectionCardImages } from '@/lib/utils/getCollectionCardImages';
import { CollectionHero } from '@/components/ui/sections/hero/CollectionHero.section';
import { palette } from '@/lib/styles/pallete';

interface CollectionsGridProps {
    title: string;
    subtitle?: string;
}

export function CollectionsGrid({ title, subtitle }: CollectionsGridProps) {
    const collections = getAllCollections();

    return (
        <Stack spacing={6}
            // bgcolor={{ xs: palette.secondary.light, md: palette.secondary.light }}
            bgcolor={{ xs: 'grey.100', md: 'grey.100' }}
            mx={0}
            px={{ xs: 0, md: 6 }}
            pb={{ xs: 8, md: 12 }}
            pt={{ xs: 6, md: 12 }}
        >
            <CollectionHero
                title={title}
                subtitle={subtitle}
                pb={{ xs: 2, md: 8 }}
            />

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
