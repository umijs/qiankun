import Garfish, { type interfaces } from 'garfish';

import { createDomPaintObserver, installBenchmark } from './benchmark';

Garfish.run({ disablePreloadApp: true });

function findGarfishCoreElement(): HTMLElement | null {
  return (
    document
      .querySelector<HTMLElement>('#micro-app-container > [id^="garfish_app_for_"]')
      ?.shadowRoot?.querySelector<HTMLElement>('#benchmark-core') ?? null
  );
}

installBenchmark(({ entry, frameworkOptions }, container) => {
  let app: interfaces.App | null = null;
  const settled = (async () => {
    app = await Garfish.loadApp('benchmark-app', {
      ...(frameworkOptions as Partial<Omit<interfaces.AppInfo, 'name'>>),
      domGetter: () => container,
      entry,
    });
    if (!app) throw new Error('Garfish failed to load');
    if (!(await app.mount())) throw new Error('Garfish failed to mount');
  })();

  return {
    async cleanup() {
      await settled.catch(() => {});
      if (app && !app.unmount()) throw new Error('Garfish failed to unmount');
    },
    settled,
  };
}, createDomPaintObserver(findGarfishCoreElement));
