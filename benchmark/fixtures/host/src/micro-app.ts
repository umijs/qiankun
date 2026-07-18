import microApp from '@micro-zoe/micro-app';

import { installBenchmark } from './benchmark';

microApp.start();

installBenchmark(({ entry, frameworkOptions }, container) => {
  const settled = microApp
    .renderApp({
      ...frameworkOptions,
      container,
      name: 'benchmark-app',
      url: entry,
    })
    .then((mounted) => {
      if (!mounted) throw new Error('MicroApp failed to mount');
    });

  return {
    async cleanup() {
      await settled.catch(() => {});
      const unmounted = await microApp.unmountApp('benchmark-app', { destroy: true });
      if (!unmounted) throw new Error('MicroApp failed to unmount');
    },
    settled,
  };
});
