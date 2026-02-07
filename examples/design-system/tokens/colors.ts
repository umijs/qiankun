/**
 * Color tokens for qiankun design system
 * Based on Ant Design color palette with modern enhancements
 */

export const colors = {
  primary: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#7fc3ff',
    300: '#4096ff',
    400: '#1677ff',
    500: '#0958d9',
    600: '#003eb3',
    700: '#002c8c',
    800: '#001d66',
    900: '#001141',
  },

  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  functional: {
    success: '#22c55e',
    successLight: '#dcfce7',
    successDark: '#15803d',
    
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    warningDark: '#b45309',
    
    error: '#ef4444',
    errorLight: '#fee2e2',
    errorDark: '#b91c1c',
    
    info: '#3b82f6',
    infoLight: '#dbeafe',
    infoDark: '#1d4ed8',
  },

  framework: {
    react: '#61dafb',
    vue: '#42b883',
    angular: '#dd0031',
    svelte: '#ff3e00',
    solid: '#446b9e',
  },
} as const;

export type Colors = typeof colors;
