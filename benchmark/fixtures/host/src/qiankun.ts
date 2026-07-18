import { type AppConfiguration, loadMicroApp, start } from 'qiankun';

import { installBenchmark } from './benchmark';

start();

installBenchmark(({ entry, frameworkOptions }, container) => {
  const app = loadMicroApp(
    {
      container,
      entry,
      name: 'benchmark-app',
    },
    frameworkOptions as AppConfiguration,
  );
  const settled = app.mountPromise.then(() => {});
  return {
    async cleanup() {
      await settled.catch(() => {});
      await app.unmount();
    },
    settled,
  };
});
