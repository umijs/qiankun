import { startApp } from 'wujie';

import { installBenchmark } from './benchmark';

installBenchmark(async ({ entry, frameworkOptions }) => {
  await startApp({
    ...frameworkOptions,
    el: '#micro-app-container',
    loading: document.createElement('span'),
    name: 'benchmark-app',
    url: entry,
  });
});
