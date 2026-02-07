/**
 * Design tokens for modern-react example
 * These tokens are synced with the design-system
 */

// Import from design-system
import { colors as designColors } from '../../design-system/tokens/colors';
import { typography as designTypography } from '../../design-system/tokens/typography';
import { spacing as designSpacing } from '../../design-system/tokens/spacing';

// Re-export for convenience
export const colors = designColors;
export const typography = designTypography;
export const spacing = designSpacing;

// Framework-specific colors for micro-app indicators
export const frameworkColors = {
  react: '#61dafb',
  vue: '#42b883',
  angular: '#dd0031',
  svelte: '#ff3e00',
  solid: '#446b9e',
} as const;

// Application status colors
export const statusColors = {
  loading: colors.functional.info,
  active: colors.functional.success,
  error: colors.functional.error,
  inactive: colors.neutral[400],
} as const;

// Export combined tokens
export const tokens = {
  colors,
  typography,
  spacing,
  frameworkColors,
  statusColors,
} as const;

export type Tokens = typeof tokens;
