'use client'

import { useState, useEffect } from 'react';

export const useScrollPosition = (threshold: number = 50) => {
  // Use null to indicate "not yet determined" state
  const [scrolled, setScrolled] = useState<boolean | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > threshold);
    };

    // Set initial scroll state immediately after mount
    updateScrollState();

    // Add scroll event listener
    window.addEventListener('scroll', updateScrollState, { passive: true });
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', updateScrollState);
    };
  }, [threshold]);

  // Return false (transparent navbar) until we have determined the actual scroll position
  // This ensures navbar starts transparent and only becomes solid when we know user has scrolled
  return scrolled ?? false;
};