/**
 * Spacing tokens for qiankun design system
 * Based on 4px grid system
 */

export const spacing = {
  // Base spacing scale
  0: '0',
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Semantic spacing aliases
export const semanticSpacing = {
  // Component spacing
  'component-xs': spacing[1],    // 4px - tight component spacing
  'component-sm': spacing[2],    // 8px - small component spacing
  'component-md': spacing[3],   // 12px - medium component spacing
  'component-lg': spacing[4],   // 16px - large component spacing
  'component-xl': spacing[6],   // 24px - extra large component spacing

  // Layout spacing
  'layout-xs': spacing[4],      // 16px - small layout gap
  'layout-sm': spacing[6],      // 24px - medium layout gap
  'layout-md': spacing[8],      // 32px - large layout gap
  'layout-lg': spacing[12],     // 48px - extra large layout gap
  'layout-xl': spacing[16],     // 64px - section gap
  'layout-2xl': spacing[24],    // 96px - major section gap

  // Content spacing
  'content-gap-xs': spacing[2],  // 8px
  'content-gap-sm': spacing[3], // 12px
  'content-gap-md': spacing[4], // 16px
  'content-gap-lg': spacing[6], // 24px

  // Edge/padding
  'edge-xs': spacing[2],        // 8px
  'edge-sm': spacing[4],        // 16px
  'edge-md': spacing[6],        // 24px
  'edge-lg': spacing[8],        // 32px
  'edge-xl': spacing[12],       // 48px
} as const;

export type Spacing = typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;
