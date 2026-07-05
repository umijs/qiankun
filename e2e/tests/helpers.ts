import type { Page } from '@playwright/test';

/**
 * The ESM sandbox rewrites module specifiers through dynamically injected import maps,
 * which Firefox does not support yet (multiple/dynamic import maps; the es-module-shims
 * fallback path is a known-open item of the ESM sandbox RFC). Tests that mount the
 * sub-esm fixture carry this as a test.fail() annotation on Firefox.
 */
export const FIREFOX_ESM_LIMITATION =
  'ESM sandbox needs dynamic import maps, unsupported in Firefox (RFC known limitation)';

type E2EWindow = Window & {
  __E2E__: {
    load(
      name: string,
      configuration?: Record<string, unknown>,
      key?: string,
      props?: Record<string, unknown>,
    ): Promise<string>;
    unmount(key: string): Promise<string>;
    resetContainer(key: string): void;
    status(key: string): string | undefined;
  };
};

export async function loadApp(
  page: Page,
  name: string,
  configuration?: Record<string, unknown>,
  key = name,
  props?: Record<string, unknown>,
): Promise<string> {
  return page.evaluate(
    ([appName, config, instanceKey, appProps]) =>
      (window as unknown as E2EWindow).__E2E__.load(
        appName as string,
        config as Record<string, unknown> | undefined,
        instanceKey as string,
        appProps as Record<string, unknown> | undefined,
      ),
    [name, configuration, key, props] as const,
  );
}

/** Load an app that is expected to fail; resolves with the rejection message. */
export async function loadAppExpectError(
  page: Page,
  name: string,
  configuration?: Record<string, unknown>,
  key = name,
  props?: Record<string, unknown>,
): Promise<string> {
  // two-handler then: a try/catch would swallow the "unexpectedly succeeded" throw itself
  return loadApp(page, name, configuration, key, props).then(
    (status) => {
      throw new Error(`expected load of ${name} to fail but it resolved with status ${status}`);
    },
    (error: Error) => error.message,
  );
}

export async function unmountApp(page: Page, key: string): Promise<string> {
  return page.evaluate((instanceKey) => (window as unknown as E2EWindow).__E2E__.unmount(instanceKey), key);
}

/** Drop and recreate the app container, the keyed re-render pattern main apps use on retry. */
export async function resetContainer(page: Page, key: string): Promise<void> {
  await page.evaluate((instanceKey) => (window as unknown as E2EWindow).__E2E__.resetContainer(instanceKey), key);
}

export async function readMainRealmGlobal(page: Page, prop: string): Promise<unknown> {
  return page.evaluate((p) => (window as unknown as Record<string, unknown>)[p], prop);
}
