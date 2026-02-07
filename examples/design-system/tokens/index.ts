/**
 * Design System Tokens
 * 
 * This is the single source of truth for all design tokens.
 * Import from here to ensure consistency across all examples.
 */

export { colors } from './colors';
export { typography } from './typography';
export { spacing, semanticSpacing } from './spacing';

// Re-export types
export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing, SemanticSpacing } from './spacing';

// Combined tokens object for easy access
import { colors } from './colors';
import { typography } from './typography';
import { spacing, semanticSpacing } from './spacing';

export const tokens = {
  colors,
  typography,
  spacing,
  semanticSpacing,
} as const;

export type Tokens = typeof tokens;
