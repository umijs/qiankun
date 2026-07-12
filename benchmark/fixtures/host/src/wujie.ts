import { destroyApp, startApp } from 'wujie';

import { createDomPaintObserver, installBenchmark } from './benchmark';

function findWujieCoreElement(): HTMLElement | null {
  return document.querySelector('wujie-app')?.shadowRoot?.querySelector<HTMLElement>('#benchmark-core') ?? null;
}

installBenchmark(({ entry, frameworkOptions }) => {
  const settled = startApp({
    ...frameworkOptions,
    el: '#micro-app-container',
    loading: document.createElement('span'),
    name: 'benchmark-app',
    url: entry,
  }).then(() => {});
  return {
    async cleanup() {
      await settled.catch(() => {});
      await destroyApp('benchmark-app');
    },
    settled,
  };
}, createDomPaintObserver(findWujieCoreElement));
