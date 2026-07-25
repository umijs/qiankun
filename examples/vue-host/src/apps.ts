export interface MicroAppMeta {
  /** qiankun app name (matches the sub app's lifecycle registration) */
  name: string;
  /** display label in the shell */
  label: string;
  /** route path that activates the app */
  path: string;
  entry: string;
  stack: string;
  loadingPath: 'esm sandbox' | 'classic' | 'never loads';
  accent: string;
  /** the Vue micro app is the only one exporting an `update` lifecycle, so only it reacts to appProps */
  acceptsProps?: boolean;
}

/** The same four micro apps the React shell hosts — mounted here through the Vue binding instead. */
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
    acceptsProps: true,
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
  {
    // deliberately unreachable: the one route that shows what the errorBoundary slot renders
    name: 'missing',
    label: 'Missing app',
    path: '/missing',
    entry: '//localhost:7104/nowhere/index.html',
    stack: 'entry returns 404',
    loadingPath: 'never loads',
    accent: '#D93026',
  },
];

export function appByPath(pathname: string): MicroAppMeta | undefined {
  return microApps.find((app) => pathname.startsWith(app.path));
}
