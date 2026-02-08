import 'server-only';

interface ProductJsonLdProps {
    name: string;
    description: string;
    sku: string;
    gtin?: string | number;
    price: number;
    currency?: string;
    imageUrl: string;
    url: string;
    brand: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
}

export function ProductJsonLd({
    name,
    description,
    sku,
    gtin,
    price,
    currency = 'EUR',
    imageUrl,
    url,
    brand,
    availability = 'InStock',
    condition = 'NewCondition',
}: ProductJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        sku,
        ...(gtin && { gtin13: String(gtin) }),
        image: imageUrl,
        url,
        brand: {
            '@type': 'Brand',
            name: brand,
        },
        offers: {
            '@type': 'Offer',
            url,
            priceCurrency: currency,
            price: price.toFixed(2),
            availability: `https://schema.org/${availability}`,
            itemCondition: `https://schema.org/${condition}`,
            seller: {
                '@type': 'Organization',
                name: 'EcoVibeFloors',
                url: 'https://ecovibefloors.com',
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
