/**
 * SERP Pixel-Width Typography Engine
 * Google clips search result titles (~580px desktop / ~560px mobile) and meta descriptions
 * (~990px desktop / ~680px mobile) by rendered pixel bounding box in Arial, not raw character count.
 * Wide glyphs ('£', 'W', 'M', 'G', '@') consume 2-3x the width of narrow glyphs ('i', 'l', 't', '|').
 */

export interface SerpPixelAudit {
  titleText: string;
  titleChars: number;
  titlePixels: number;
  titleMaxPixels: number;
  isTitleWithinPixelBudget: boolean;
  metaText: string;
  metaChars: number;
  metaPixels: number;
  metaMaxPixels: number;
  isMetaWithinPixelBudget: boolean;
}

export const SERP_PIXEL_BUDGETS = {
  DESKTOP_TITLE_MAX_PX: 580,
  DESKTOP_TITLE_MIN_PX: 320,
  MOBILE_TITLE_MAX_PX: 550,
  DESKTOP_META_MAX_PX: 990,
  DESKTOP_META_MIN_PX: 650,
  MOBILE_META_MAX_PX: 680,
} as const;

/**
 * Standard Arial 20px character advance widths (in pixels) used by Google Desktop SERP Titles.
 * Meta descriptions (Arial 14px) scale proportionally by 0.70x.
 */
const ARIAL_20PX_CHAR_WIDTHS: Record<string, number> = {
  // Uppercase
  A: 13.3, B: 13.3, C: 14.4, D: 14.4, E: 13.3, F: 12.2, G: 15.6, H: 14.4,
  I: 5.6,  J: 10.0, K: 13.3, L: 11.1, M: 16.7, N: 14.4, O: 15.6, P: 13.3,
  Q: 15.6, R: 14.4, S: 13.3, T: 12.2, U: 14.4, V: 13.3, W: 18.9, X: 13.3,
  Y: 13.3, Z: 12.2,
  // Lowercase
  a: 11.1, b: 11.1, c: 10.0, d: 11.1, e: 11.1, f: 5.6,  g: 11.1, h: 11.1,
  i: 4.4,  j: 4.4,  k: 10.0, l: 4.4,  m: 16.7, n: 11.1, o: 11.1, p: 11.1,
  q: 11.1, r: 6.7,  s: 10.0, t: 5.6,  u: 11.1, v: 10.0, w: 14.4, x: 10.0,
  y: 10.0, z: 10.0,
  // Digits & Currency
  '0': 11.1, '1': 11.1, '2': 11.1, '3': 11.1, '4': 11.1,
  '5': 11.1, '6': 11.1, '7': 11.1, '8': 11.1, '9': 11.1,
  '£': 11.8, '$': 11.1, '€': 11.8, '%': 17.8,
  // Punctuation & Symbols
  ' ': 5.6,  '.': 5.6,  ',': 5.6,  ':': 5.6,  ';': 5.6,  '!': 5.6,
  '?': 11.1, '-': 6.7,  '–': 11.1, '—': 20.0, '|': 5.2,  '/': 5.6,
  '(': 6.7,  ')': 6.7,  '[': 5.6,  ']': 5.6,  '&': 13.3, "'": 3.8,
  '"': 7.1,  '+': 11.7, '=': 11.7, '→': 16.0,
};

const DEFAULT_CHAR_WIDTH_20PX = 11.1;
const META_14PX_SCALE_FACTOR = 0.70; // 14px / 20px

/**
 * Calculates rendered pixel width for a Google SERP Title (Arial 20px) or Meta Description (Arial 14px)
 */
export function calculateSerpPixelWidth(
  text: string,
  elementType: 'title' | 'meta' = 'title'
): number {
  if (!text) return 0;

  let width20px = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    width20px += ARIAL_20PX_CHAR_WIDTHS[ch] ?? DEFAULT_CHAR_WIDTH_20PX;
  }

  const finalWidth = elementType === 'meta' ? width20px * META_14PX_SCALE_FACTOR : width20px;
  return Math.round(finalWidth);
}

/**
 * Evaluates both title and meta description against Google SERP pixel bounding box budgets
 */
export function auditSerpPixelBudgets(title: string, metaDescription: string): SerpPixelAudit {
  const titlePixels = calculateSerpPixelWidth(title, 'title');
  const metaPixels = calculateSerpPixelWidth(metaDescription, 'meta');

  return {
    titleText: title,
    titleChars: title.length,
    titlePixels,
    titleMaxPixels: SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX,
    isTitleWithinPixelBudget:
      titlePixels >= SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MIN_PX &&
      titlePixels <= SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX,
    metaText: metaDescription,
    metaChars: metaDescription.length,
    metaPixels,
    metaMaxPixels: SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX,
    isMetaWithinPixelBudget:
      metaPixels >= SERP_PIXEL_BUDGETS.DESKTOP_META_MIN_PX &&
      metaPixels <= SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX,
  };
}
