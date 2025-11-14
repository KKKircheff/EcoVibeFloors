/**
 * Configuration: Pages to scrape with Jina.ai Reader API
 */

import type { PageToScrape } from '@/lib/chat-ai-assistant/types';

export const PAGES_TO_SCRAPE: PageToScrape[] = [
  // Home pages
  {
    url: 'https://ecovibefloors.com/en',
    locale: 'en',
    type: 'home',
    category: 'general',
  },
  {
    url: 'https://ecovibefloors.com/bg',
    locale: 'bg',
    type: 'home',
    category: 'general',
  },

  // Collection overview pages
  {
    url: 'https://ecovibefloors.com/en/hybrid-wood',
    locale: 'en',
    type: 'collection',
    category: 'hybrid-wood',
  },
  {
    url: 'https://ecovibefloors.com/bg/hybrid-wood',
    locale: 'bg',
    type: 'collection',
    category: 'hybrid-wood',
  },
  {
    url: 'https://ecovibefloors.com/en/oak',
    locale: 'en',
    type: 'collection',
    category: 'oak',
  },
  {
    url: 'https://ecovibefloors.com/bg/oak',
    locale: 'bg',
    type: 'collection',
    category: 'oak',
  },
  {
    url: 'https://ecovibefloors.com/en/click-vinyl',
    locale: 'en',
    type: 'collection',
    category: 'click-vinyl',
  },
  {
    url: 'https://ecovibefloors.com/bg/click-vinyl',
    locale: 'bg',
    type: 'collection',
    category: 'click-vinyl',
  },
  {
    url: 'https://ecovibefloors.com/en/glue-down-vinyl',
    locale: 'en',
    type: 'collection',
    category: 'glue-down-vinyl',
  },
  {
    url: 'https://ecovibefloors.com/bg/glue-down-vinyl',
    locale: 'bg',
    type: 'collection',
    category: 'glue-down-vinyl',
  },

  // Educational "what-is" pages
  {
    url: 'https://ecovibefloors.com/en/hybrid-wood/what-is-hybrid-wood',
    locale: 'en',
    type: 'educational',
    category: 'hybrid-wood',
  },
  {
    url: 'https://ecovibefloors.com/bg/hybrid-wood/what-is-hybrid-wood',
    locale: 'bg',
    type: 'educational',
    category: 'hybrid-wood',
  },
  {
    url: 'https://ecovibefloors.com/en/oak/what-is-oak-flooring',
    locale: 'en',
    type: 'educational',
    category: 'oak',
  },
  {
    url: 'https://ecovibefloors.com/bg/oak/what-is-oak-flooring',
    locale: 'bg',
    type: 'educational',
    category: 'oak',
  },
  {
    url: 'https://ecovibefloors.com/en/click-vinyl/what-is-click-vinyl',
    locale: 'en',
    type: 'educational',
    category: 'click-vinyl',
  },
  {
    url: 'https://ecovibefloors.com/bg/click-vinyl/what-is-click-vinyl',
    locale: 'bg',
    type: 'educational',
    category: 'click-vinyl',
  },
  {
    url: 'https://ecovibefloors.com/en/glue-down-vinyl/what-is-glue-down-vinyl',
    locale: 'en',
    type: 'educational',
    category: 'glue-down-vinyl',
  },
  {
    url: 'https://ecovibefloors.com/bg/glue-down-vinyl/what-is-glue-down-vinyl',
    locale: 'bg',
    type: 'educational',
    category: 'glue-down-vinyl',
  },
];
