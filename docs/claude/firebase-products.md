# Firebase Product Architecture

## Why Firestore (not TypeScript constants)

Products were previously hardcoded in `collections/*.ts`. Firestore enables:
- Admin panel edits go live immediately (no redeploy)
- New products appear on the site without a code change
- The same data powers both the public site and the admin panel

The TypeScript collection files still exist as the **seed source of truth** but are not imported by any page at runtime.

---

## Data Flow

```
collections/*.ts  →  npm run seed  →  Firestore (doc ID = product slug)
                                            ↓
                    generateStaticParams reads all slugs at build time
                                            ↓
                    Product pages pre-built as static HTML (381 pages)
                                            ↓
                    Admin saves product → revalidateProduct() → page cache purged
                                            ↓
                    Next visitor triggers fresh Firestore fetch → page re-cached
```

---

## Firestore Document Structure

- **Firestore collection**: `products`
- **Document ID**: product slug (e.g. `oak-a0000120`, `nature-garda-greybeige`)
- **Why slug not SKU**: the URL param on product pages IS the slug, so `getProductBySlug(slug)` is a direct O(1) doc lookup — no query needed

Each document contains the full product object from the TypeScript source, plus:
- `seededAt`: Firestore server timestamp added by the seed script

> **Important**: `seededAt` is a Firestore `Timestamp` object. It must be stripped before the data reaches any Client Component — Next.js 16 cannot serialize Timestamps across the Server→Client boundary. The `serialize()` helper in `lib/firebase/admin-products.ts` handles this automatically by filtering out any `Timestamp` instances.

---

## Collection Field Values

The `collection` field in Firestore matches the TypeScript source exactly:

| Collection | `collection` field value | TS folder |
|---|---|---|
| Oak | `'oak'` | `collections/oak.ts` |
| Click Vinyl | `'click-vinyl'` | `collections/click-vinyl.ts` |
| Glue-Down Vinyl | `'glue-down-vinyl'` | `collections/glue-down-vinyl.ts` |
| Hybrid Wood | **`'hybrid-wood'`** | `collections/hy-wood.ts` |

**Gotcha**: The hybrid-wood TypeScript folder is named `hy-wood` but the products have `collection: 'hybrid-wood'`. Always filter with `'hybrid-wood'`, never `'hy-wood'`.

---

## Server-Side Query Functions

All in `lib/firebase/admin-products.ts` (server-only, uses Admin SDK).

### `getProductBySlug(slug)`
Used in product detail pages. Direct doc lookup by ID — no Firestore query.
```tsx
const product = await getProductBySlug(slug); // slug comes from URL params
if (!product) notFound();
```

### `getAllProducts()`
Used in `generateStaticParams` for detail pages. Fetches all 135 products, then filter in JS.
```tsx
const products = await getAllProducts();
const oakProducts = products.filter((p) => p.collection === 'oak');
```
JS filtering (not Firestore `where`) avoids needing composite indexes at build time.

### `getProductsByCollectionAndPattern(collection, pattern)`
Used in pattern listing pages (e.g. `/oak/plank`). Firestore compound query.
```tsx
const products = await getProductsByCollectionAndPattern('hybrid-wood', pattern);
```
Requires a Firestore composite index on `(collection ASC, pattern ASC)`. If missing, Firestore returns an error with a direct link to create it.

### `getProductsByCollection(collection)`
Used in collection landing pages. Single `where` query.

---

## On-Demand Revalidation

File: `app/[locale]/admin/(protected)/actions.ts`

```typescript
'use server';
export async function revalidateProduct(collection, pattern, slug) {
    for (const locale of routing.locales) {
        revalidatePath(`/${locale}/${collection}/${pattern}/${slug}`); // detail page
        revalidatePath(`/${locale}/${collection}/${pattern}`);         // pattern listing page
    }
}
```

The admin `ProductForm` calls this after every successful save. Next.js purges the cached HTML for those paths — the next visitor triggers a fresh Firestore fetch and the page re-caches.

**Result**: Admin edits go live in seconds with zero redeploy.

---

## Seed Script

File: `utils/seed-firestore.ts`

```bash
npm run seed:dry                          # verify what would be uploaded (no writes)
npm run seed                              # seed all 4 collections
npm run seed -- --collection=oak          # seed one collection only
```

- **Idempotent**: uses `merge: true` — safe to re-run, won't overwrite admin-panel edits to unrelated fields
- **Doc ID = slug**: `db.collection('products').doc(product.slug).set(...)`
- **After running**: if old SKU-based docs exist from before the migration, they must be manually deleted (doc ID ≠ `slug` field value means they're stale)

When to re-seed:
- You've added new products to the TypeScript collection files
- You want to bulk-reset products to match the TypeScript source

---

## Admin Panel Integration

File: `components/admin/products/ProductForm.tsx`

- Firestore doc ID = `values.slug` (not `values.sku` — this changed during migration)
- After create or update → `await revalidateProduct(values.collection, values.pattern, values.slug)`
- Uses the **client-side** Firebase SDK (not Admin SDK) since `ProductForm` is a Client Component

---

## Treatments — NOT in Firestore

Oak color treatments are still loaded from JSON:

```
collections/dig-oak-treatments.json  →  utils/treatments/index.ts  →  oak product pages
```

Treatments weren't migrated because they change rarely and don't need admin-panel editing. If that changes in the future, the same Firestore pattern applies.

---

## Files Reference

| File | Role |
|---|---|
| `lib/firebase-admin.ts` | Admin SDK singleton (server-only) |
| `lib/firebase/admin-products.ts` | All server-side Firestore queries + Timestamp serialization |
| `app/[locale]/admin/(protected)/actions.ts` | `revalidateProduct` / `revalidateTreatment` Server Actions |
| `utils/seed-firestore.ts` | Seed script — TypeScript → Firestore |
| `collections/*.ts` | TypeScript source of truth for seeding (not imported at runtime) |
| `collections/dig-oak-treatments.json` | Treatment data (JSON, bypasses Firestore) |
| `utils/treatments/index.ts` | Reads treatment JSON, used by oak product pages |
