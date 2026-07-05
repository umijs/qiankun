export interface MicroAppMeta {
  /** qiankun app name (matches the sub app's lifecycle registration) */
  name: string;
  /** display label in the shell */
  label: string;
  /** route path that activates the app */
  path: string;
  entry: string;
  stack: string;
  loadingPath: 'esm sandbox' | 'classic';
  accent: string;
}

export const microApps: MicroAppMeta[] = [
  {
    name: 'react',
    label: 'React',
    path: '/react',
    entry: '//localhost:7100',
    stack: 'React 19 · Vite 8',
    loadingPath: 'esm sandbox',
    accent: '#087EA4',
  },
  {
    name: 'vue',
    label: 'Vue',
    path: '/vue',
    entry: '//localhost:7101',
    stack: 'Vue 3.5 · Vite 8',
    loadingPath: 'esm sandbox',
    accent: '#42B883',
  },
  {
    name: 'webpack-app',
    label: 'Webpack',
    path: '/webpack',
    entry: '//localhost:7102',
    stack: 'React 19 · webpack 5',
    loadingPath: 'classic',
    accent: '#1C78C0',
  },
  {
    name: 'purehtml',
    label: 'Pure HTML',
    path: '/purehtml',
    entry: '//localhost:7104',
    stack: 'no build · jQuery',
    loadingPath: 'classic',
    accent: '#B8860B',
  },
];

export function appByPath(pathname: string): MicroAppMeta | undefined {
  return microApps.find((app) => pathname.startsWith(app.path));
}
