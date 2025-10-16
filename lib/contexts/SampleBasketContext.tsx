'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface SampleItem {
    sku: string;
    productName: string;
    collection: string;
    pattern: string;
    price: number;
    imageUrl: string;
}

interface SampleBasketContextType {
    items: SampleItem[];
    addItem: (item: SampleItem) => { success: boolean; message: string };
    removeItem: (sku: string) => void;
    clearBasket: () => void;
    isInBasket: (sku: string) => boolean;
    itemCount: number;
}

const SampleBasketContext = createContext<SampleBasketContextType | undefined>(undefined);

const STORAGE_KEY = 'ecovibefloors_sample_basket';
const MAX_ITEMS = 5;

export function SampleBasketProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<SampleItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setItems(Array.isArray(parsed) ? parsed : []);
            } catch (error) {
                console.error('Failed to parse basket from localStorage:', error);
                setItems([]);
            }
        }
        setIsHydrated(true);
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isHydrated]);

    const addItem = (item: SampleItem): { success: boolean; message: string } => {
        // Check if already in basket
        if (items.some((i) => i.sku === item.sku)) {
            return { success: false, message: 'Sample already in basket' };
        }

        // Check max limit
        if (items.length >= MAX_ITEMS) {
            return { success: false, message: `Maximum ${MAX_ITEMS} samples allowed` };
        }

        setItems((prev) => [...prev, item]);
        return { success: true, message: 'Sample added to basket' };
    };

    const removeItem = (sku: string) => {
        setItems((prev) => prev.filter((item) => item.sku !== sku));
    };

    const clearBasket = () => {
        setItems([]);
    };

    const isInBasket = (sku: string): boolean => {
        return items.some((item) => item.sku === sku);
    };

    const value: SampleBasketContextType = {
        items,
        addItem,
        removeItem,
        clearBasket,
        isInBasket,
        itemCount: items.length,
    };

    return <SampleBasketContext.Provider value={value}>{children}</SampleBasketContext.Provider>;
}

export function useSampleBasket(): SampleBasketContextType {
    const context = useContext(SampleBasketContext);
    if (context === undefined) {
        throw new Error('useSampleBasket must be used within SampleBasketProvider');
    }
    return context;
}
