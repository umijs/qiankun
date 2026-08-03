import { type Locale } from './i18n';

export interface MicroAppMeta {
  /** qiankun app name (matches the sub app's lifecycle registration) */
  name: string;
  /** display label in the shell */
  label: string;
  /** route path that activates the app */
  path: string;
  entry: string;
  /** only the prose half varies by locale; version numbers and tool names do not translate */
  stack: Record<Locale, string>;
  loadingPath: 'esm sandbox' | 'classic' | 'streamed' | 'never loads';
  accent: string;
}

const deployed = import.meta.env.MODE === 'pages';

/**
 * Each micro app is its own origin in dev (one dev server per app) but a path on the deployed
 * site, where all of them are static builds under `/apps/`. `pages` is the mode
 * `scripts/build-examples-site.mjs` builds the shells with; a plain `vite build` still targets
 * the dev servers, so nothing about the local flow changes.
 */
const entryOf = (name: string, devPort: number): string => (deployed ? `/apps/${name}/` : `//localhost:${devPort}`);

/**
 * This shell is served from the site root in dev but from `/vue-host/` once deployed, so its
 * routes hang off Vite's base rather than assuming the root.
 */
const routeOf = (segment: string): string => `${import.meta.env.BASE_URL}${segment}`;

/** The same five micro apps the React shell hosts — mounted here through the Vue binding instead. */
export const microApps: MicroAppMeta[] = [
  {
    name: 'react',
    label: 'React',
    path: routeOf('react'),
    entry: entryOf('react', 7100),
    stack: { en: 'React 19 · Vite 8', zh: 'React 19 · Vite 8' },
    loadingPath: 'esm sandbox',
    accent: '#087EA4',
  },
  {
    name: 'vue',
    label: 'Vue',
    path: routeOf('vue'),
    entry: entryOf('vue', 7101),
    stack: { en: 'Vue 3.5 · Vite 8', zh: 'Vue 3.5 · Vite 8' },
    loadingPath: 'esm sandbox',
    accent: '#42B883',
  },
  {
    name: 'webpack-app',
    label: 'Webpack',
    path: routeOf('webpack'),
    entry: entryOf('webpack', 7102),
    stack: { en: 'React 19 · webpack 5', zh: 'React 19 · webpack 5' },
    loadingPath: 'classic',
    accent: '#1C78C0',
  },
  {
    name: 'purehtml',
    label: 'Pure HTML',
    path: routeOf('purehtml'),
    entry: entryOf('purehtml', 7104),
    stack: { en: 'no build · jQuery', zh: '无需构建 · jQuery' },
    loadingPath: 'classic',
    accent: '#B8860B',
  },
  {
    // the loading path IS the exhibit: the server flushes the entry HTML in paced chunks and
    // qiankun paints each one as it lands — content is readable before the entry script exists.
    // The stage drops its covering veil for this app; a veil would hide exactly that.
    name: 'streaming',
    label: 'Streaming',
    path: routeOf('streaming'),
    entry: entryOf('streaming', 7106),
    stack: { en: 'SSR chunks · no build', zh: 'SSR 分块 · 无需构建' },
    loadingPath: 'streamed',
    accent: '#C2410C',
  },
  {
    // deliberately unreachable: the one route that shows what the errorBoundary slot renders.
    // Deployed, `/apps/missing/` has no build behind it and the site's 404.html answers with a
    // real 404, so the entry fetch throws there exactly as it does against the dev server.
    name: 'missing',
    label: 'Missing app',
    path: routeOf('missing'),
    entry: deployed ? '/apps/missing/index.html' : '//localhost:7104/nowhere/index.html',
    stack: { en: 'entry returns 404', zh: '入口返回 404' },
    loadingPath: 'never loads',
    accent: '#D93026',
  },
];

/** The other shell. Cross-linked both ways so neither is a dead end for someone browsing the deployed site. */
export const siblingShell = {
  label: 'React host',
  sub: '@qiankunjs/react',
  href: deployed ? '/' : 'http://localhost:7099',
};

export function appByPath(pathname: string): MicroAppMeta | undefined {
  return microApps.find((app) => pathname.startsWith(app.path));
}
