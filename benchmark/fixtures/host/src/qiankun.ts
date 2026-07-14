import { type AppConfiguration, loadMicroApp } from 'qiankun';

import { installBenchmark } from './benchmark';

installBenchmark(async ({ entry, frameworkOptions }) => {
  const container = document.querySelector<HTMLElement>('#micro-app-container');
  if (!container) throw new Error('micro app container is missing');
  const app = loadMicroApp(
    {
      container,
      entry,
      name: 'benchmark-app',
    },
    frameworkOptions as AppConfiguration,
  );
  await app.mountPromise;
});
