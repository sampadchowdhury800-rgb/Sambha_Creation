/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Site Constants
   ══════════════════════════════════════════════════════════════ */

export const SITE_NAME = 'Sambha Creation';
export const SITE_DESCRIPTION =
  'Premium news platform delivering the latest stories in entertainment, technology, culture, science, and lifestyle with elegant design.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sambhacreation.com';

export const ADMIN_ROUTE = '/secure-admin-login';
export const ADMIN_DASHBOARD = '/admin';

export const PAGE_SIZE = 4; // Articles per batch (infinite scroll)
export const SEARCH_LIMIT = 6; // Max search suggestions

export const READING_SPEED_WPM = 200; // Words per minute for reading time

export const CATEGORY_EMOJI_MAP: Record<string, string> = {
  entertainment: '🎬',
  technology: '⚡',
  culture: '🏛️',
  lifestyle: '✨',
  science: '🔬',
  sports: '🏆',
  business: '📊',
  politics: '🏛️',
  nature: '🌿',
  crime: '🚨',
  cybersecurity: '🔒',
  india: '🇮🇳',
};

export const CATEGORY_CSS_MAP: Record<string, string> = {
  entertainment: 'cat-entertainment',
  technology: 'cat-technology',
  culture: 'cat-culture',
  lifestyle: 'cat-lifestyle',
  science: 'cat-science',
  sports: 'cat-sports',
  business: 'cat-business',
  politics: 'cat-politics',
  nature: 'cat-nature',
  crime: 'cat-default',
  cybersecurity: 'cat-technology',
  india: 'cat-default',
};

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/_sambha_creation?igsh=OTZiYXdtazNyeTM0',
  facebook: 'https://www.facebook.com/share/18pN5KsRwf/',
  youtube: 'https://youtube.com/@sambhaanimation?si=QWlxu0nued5PLlgp',
};

