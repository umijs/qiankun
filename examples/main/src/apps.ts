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

/**
 * Each micro app is its own origin in dev (one dev server per app) but a path on the deployed
 * site, where all of them are static builds under `/apps/`. `pages` is the mode
 * `scripts/build-examples-site.mjs` builds the shells with; a plain `vite build` still targets
 * the dev servers, so nothing about the local flow changes.
 */
const entryOf = (name: string, devPort: number): string =>
  import.meta.env.MODE === 'pages' ? `/apps/${name}/` : `//localhost:${devPort}`;

export const microApps: MicroAppMeta[] = [
  {
    name: 'react',
    label: 'React',
    path: '/react',
    entry: entryOf('react', 7100),
    stack: 'React 19 · Vite 8',
    loadingPath: 'esm sandbox',
    accent: '#087EA4',
  },
  {
    name: 'vue',
    label: 'Vue',
    path: '/vue',
    entry: entryOf('vue', 7101),
    stack: 'Vue 3.5 · Vite 8',
    loadingPath: 'esm sandbox',
    accent: '#42B883',
  },
  {
    name: 'webpack-app',
    label: 'Webpack',
    path: '/webpack',
    entry: entryOf('webpack', 7102),
    stack: 'React 19 · webpack 5',
    loadingPath: 'classic',
    accent: '#1C78C0',
  },
  {
    name: 'purehtml',
    label: 'Pure HTML',
    path: '/purehtml',
    entry: entryOf('purehtml', 7104),
    stack: 'no build · jQuery',
    loadingPath: 'classic',
    accent: '#B8860B',
  },
];

/** The other shell. Cross-linked both ways so neither is a dead end for someone browsing the deployed site. */
export const siblingShell = {
  label: 'Vue host',
  sub: '@qiankunjs/vue',
  href: import.meta.env.MODE === 'pages' ? '/vue-host/' : 'http://localhost:7105',
};

export function appByPath(pathname: string): MicroAppMeta | undefined {
  return microApps.find((app) => pathname.startsWith(app.path));
}
