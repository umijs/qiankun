/**
 * Typography tokens for qiankun design system
 */

export const typography = {
  fontFamily: {
    sans: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(', '),
    
    mono: [
      'Fira Code',
      'JetBrains Mono',
      'Consolas',
      'Monaco',
      'Courier New',
      'monospace',
    ].join(', '),
    
    display: [
      'Inter',
      'system-ui',
      'sans-serif',
    ].join(', '),
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Preset text styles
  text: {
    h1: {
      fontSize: '2.25rem',  // 36px
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',   // 24px
      fontWeight: '600',
      lineHeight: '1.4',
    },
    h4: {
      fontSize: '1.25rem',  // 20px
      fontWeight: '600',
      lineHeight: '1.5',
    },
    body: {
      fontSize: '1rem',     // 16px
      fontWeight: '400',
      lineHeight: '1.6',
    },
    small: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.5',
    },
    caption: {
      fontSize: '0.75rem',  // 12px
      fontWeight: '400',
      lineHeight: '1.4',
    },
  },
} as const;

export type Typography = typeof typography;
