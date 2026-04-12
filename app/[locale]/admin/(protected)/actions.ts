'use server';

/**
 * Admin Server Actions — revalidate static product pages after saves.
 *
 * Called from ProductForm after a successful create/update so the public
 * pages reflect the new data without a full redeploy.
 */

import { revalidatePath } from 'next/cache';
import { routing } from '@/i18n/routing';

/**
 * Purge cached pages for a specific product across all locales.
 * Next.js will regenerate the page on the next visitor's request.
 */
export async function revalidateProduct(
    collection: string,
    pattern: string,
    slug: string
): Promise<void> {
    for (const locale of routing.locales) {
        revalidatePath(`/${locale}/${collection}/${pattern}/${slug}`);
        // Also revalidate the pattern listing page (shows updated product card)
        revalidatePath(`/${locale}/${collection}/${pattern}`);
    }
}

/**
 * Purge cached pages for an oak treatment across all locales.
 */
export async function revalidateTreatment(slug: string): Promise<void> {
    for (const locale of routing.locales) {
        revalidatePath(`/${locale}/oak/treatments/${slug}`);
    }
}
