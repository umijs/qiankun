import { type FrameworkConfiguration, loadMicroApp, start } from 'qiankun-v2';

import { installBenchmark } from './benchmark';

start({ prefetch: false });

installBenchmark(({ entry, frameworkOptions }, container) => {
  const app = loadMicroApp(
    {
      container,
      entry,
      name: 'benchmark-app',
    },
    frameworkOptions as FrameworkConfiguration,
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
