/**
 * Treatment utilities
 * Functions for retrieving and filtering oak color treatments
 */

import { OakTreatment, TreatmentCategory, TreatmentCollection } from '@/types/treatments';
import treatmentData from '@/collections/dig-oak-treatments.json';

/**
 * Get all oak treatments
 */
export function getAllTreatments(): OakTreatment[] {
    return (treatmentData as TreatmentCollection).treatments;
}

/**
 * Get a single treatment by slug
 */
export function getTreatmentBySlug(slug: string): OakTreatment | null {
    const treatments = getAllTreatments();
    return treatments.find(treatment => treatment.slug === slug) || null;
}

/**
 * Get treatments filtered by category
 */
export function getTreatmentsByCategory(category: TreatmentCategory): OakTreatment[] {
    const treatments = getAllTreatments();
    return treatments.filter(treatment => treatment.category === category);
}

/**
 * Get total count of treatments
 */
export function getTreatmentCount(): number {
    return getAllTreatments().length;
}

/**
 * Get treatment collection metadata
 */
export function getTreatmentMetadata() {
    return (treatmentData as TreatmentCollection).metadata;
}

/**
 * Get all unique categories from treatments
 */
export function getTreatmentCategories(): TreatmentCategory[] {
    const treatments = getAllTreatments();
    const categories = treatments.map(t => t.category);
    return Array.from(new Set(categories));
}

/**
 * Count treatments by category
 */
export function getTreatmentCountByCategory(category: TreatmentCategory): number {
    return getTreatmentsByCategory(category).length;
}
