# Product Components

This directory contains reusable components for product pages and sections. These components provide consistent styling and behavior across different product pages.

## Components

### ProductFeature

A card component for highlighting product features and benefits.

**Props:**
- `icon?: string` - Text/emoji to display as icon
- `title: string` - Feature title
- `description: string` - Feature description
- `iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'` - Icon background color
- `variant?: 'standard' | 'compact'` - Size variant

**Usage:**
```tsx
import { ProductFeature } from '@/components/ui/product';

<ProductFeature
    icon="24h"
    title="Water Resistant"
    description="24-hour water resistance protects against spills and moisture"
    iconColor="primary"
    variant="standard"
/>
```

### TechnicalSpecs

A component for displaying technical specifications in a structured format.

**Props:**
- `title: string` - Section title
- `specs: SpecItem[]` - Array of specification items
- `variant?: 'card' | 'list'` - Display variant
- `titleColor?: string` - Title color (MUI theme color)

**SpecItem Interface:**
```typescript
interface SpecItem {
    label: string;
    value: string;
    highlight?: boolean; // Highlights the value with primary color
}
```

**Usage:**
```tsx
import { TechnicalSpecs } from '@/components/ui/product';

const specs = [
    { label: "Thickness", value: "9.5mm" },
    { label: "Thermal Resistance", value: "0.07 m²K/W" },
    { label: "Wear Layer", value: "Real Oak", highlight: true }
];

<TechnicalSpecs
    title="Technical Details"
    specs={specs}
    variant="card"
    titleColor="secondary.main"
/>
```

### ProductSection

A wrapper component for consistent product page sections with title, subtitle, description, and content.

**Props:**
- `title: string` - Section title
- `subtitle?: string` - Optional subtitle
- `description?: string` - Optional description text
- `children?: ReactNode` - Section content
- `backgroundColor?: string` - Background color (MUI theme color)
- `titleColor?: string` - Title color (MUI theme color)
- `textColor?: string` - Text color (MUI theme color)
- `maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` - Container max width
- `spacing?: number` - Spacing between elements
- `textAlign?: 'left' | 'center' | 'right'` - Text alignment
- `py?: { xs: number; md: number }` - Vertical padding

**Usage:**
```tsx
import { ProductSection } from '@/components/ui/product';

<ProductSection
    title="Superior Performance Features"
    subtitle="Experience the future of flooring"
    description="Our hybrid wood floors combine the best of traditional craftsmanship with modern technology."
    backgroundColor="grey.50"
    titleColor="primary.main"
    textAlign="center"
    maxWidth="lg"
>
    {/* Your content here */}
</ProductSection>
```

## Design Guidelines

### Color Usage
- **Primary colors** for main features and highlights
- **Secondary colors** for supporting information
- **Success/Warning/Error colors** for specific states or warnings

### Spacing
- Use consistent spacing values from MUI theme
- Standard sections use `py={{ xs: 6, md: 10 }}`
- Internal spacing typically uses multiples of 2 or 4

### Typography
- Follow MUI typography hierarchy
- Use `fontWeight={600}` for titles
- Use `fontWeight={500}` for subtitles
- Line height of 1.6-1.8 for body text

### Responsive Design
- All components are mobile-first responsive
- Use MUI breakpoints for consistent behavior
- Consider touch targets for mobile devices

## Example Implementation

Here's how these components can be used together in a product page:

```tsx
import { Grid } from '@mui/material';
import { ProductSection, ProductFeature, TechnicalSpecs } from '@/components/ui/product';

// Features section
<ProductSection
    title="Key Features"
    backgroundColor="grey.50"
    textAlign="center"
>
    <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
            <ProductFeature
                icon="24h"
                title="Water Resistant"
                description="Superior moisture protection"
                iconColor="primary"
            />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
            <ProductFeature
                icon="AC5"
                title="Scratch Resistant"
                description="Extremely durable surface"
                iconColor="secondary"
            />
        </Grid>
    </Grid>
</ProductSection>

// Specifications section
<ProductSection
    title="Technical Specifications"
    backgroundColor="background.paper"
>
    <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
            <TechnicalSpecs
                title="Technical Details"
                specs={technicalSpecs}
                variant="card"
            />
        </Grid>
    </Grid>
</ProductSection>
```