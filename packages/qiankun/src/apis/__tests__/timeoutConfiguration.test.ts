/**
 * @vitest-environment happy-dom
 */
import { type ParcelConfigObject } from '@qiankunjs/single-spa';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type LoadAppControl, type ParcelConfigObjectGetter } from '../../core/loadApp';
import { type AppConfiguration, type LifeCycles, type LoadableApp, type MicroApp, type ObjectType } from '../../types';

const mocks = vi.hoisted(() => ({
  loadApp:
    vi.fn<
      (
        app: LoadableApp<ObjectType>,
        configuration?: AppConfiguration,
        lifeCycles?: LifeCycles<ObjectType>,
        control?: LoadAppControl,
      ) => Promise<ParcelConfigObjectGetter>
    >(),
  registerApplication: vi.fn<(app: { name: string; app: () => Promise<ParcelConfigObject> }) => void>(),
  startSingleSpa: vi.fn(),
}));

vi.mock('../../core/loadApp', () => ({ default: mocks.loadApp }));
vi.mock('@qiankunjs/single-spa', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  registerApplication: mocks.registerApplication,
  start: mocks.startSingleSpa,
}));

const registeredLoaders = new Map<string, () => Promise<ParcelConfigObject>>();
const parcels: MicroApp[] = [];
let api: typeof import('../registerMicroApps');
let loadMicroApp: (typeof import('../loadMicroApp'))['loadMicroApp'];
let appId = 0;

function createApp() {
  const name = `timeout-configuration-${++appId}`;
  return { name, entry: `https://timeout-configuration.test/${name}.html`, container: document.createElement('div') };
}

async function loadManualAndRegistered(configuration?: AppConfiguration) {
  const manual = loadMicroApp(createApp(), configuration);
  parcels.push(manual);
  await manual.mountPromise;

  const registered = createApp();
  api.registerMicroApps([{ ...registered, activeRule: () => false, configuration }]);
  await registeredLoaders.get(registered.name)!();
}

describe('loading timeout configuration', () => {
  beforeEach(async () => {
    // start() is deliberately one-shot, so every case gets its own framework configuration.
    vi.resetModules();
    vi.resetAllMocks();
    mocks.loadApp.mockImplementation(async (_app, _configuration, _lifeCycles, control) => {
      control?.onDispose?.(async () => {});
      const lifecycle = async (): Promise<void> => {};
      return () => ({ bootstrap: lifecycle, mount: lifecycle, unmount: lifecycle });
    });
    mocks.registerApplication.mockImplementation((app) => registeredLoaders.set(app.name, app.app));
    api = await import('../registerMicroApps');
    ({ loadMicroApp } = await import('../loadMicroApp'));
  });

  afterEach(async () => {
    await Promise.all(parcels.splice(0).map((parcel) => parcel.unload()));
    registeredLoaders.clear();
    vi.restoreAllMocks();
  });

  it.each([undefined, 0])('leaves loading timeouts disabled with a global timeout of %s', async (timeout) => {
    api.start(timeout === undefined ? undefined : { timeout });
    await loadManualAndRegistered();

    expect(mocks.loadApp.mock.calls.map(([, configuration]) => configuration?.timeout)).toEqual([timeout, timeout]);
    expect(mocks.startSingleSpa).toHaveBeenCalledWith({});
  });

  it.each([
    { local: undefined, expected: 100 },
    { local: 0, expected: 0 },
    { local: 250, expected: 250 },
  ])(
    'applies global defaults and a local timeout of $local to manual and registered apps',
    async ({ local, expected }) => {
      api.start({ timeout: 100, urlRerouteOnly: true });
      await loadManualAndRegistered(local === undefined ? undefined : { timeout: local });

      expect(mocks.loadApp.mock.calls.map(([, configuration]) => configuration?.timeout)).toEqual([expected, expected]);
      expect(mocks.startSingleSpa).toHaveBeenCalledWith({ urlRerouteOnly: true });
    },
  );

  it('inherits the global timeout when an application explicitly passes undefined', async () => {
    api.start({ timeout: 100 });
    await loadManualAndRegistered({ timeout: undefined });

    expect(mocks.loadApp.mock.calls.map(([, configuration]) => configuration?.timeout)).toEqual([100, 100]);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects invalid global timeout %s before starting single-spa',
    async (timeout) => {
      const { QiankunError } = await import('../../error');
      expect(() => api.start({ timeout })).toThrow(QiankunError);
      expect(api.started).toBe(false);
      expect(mocks.startSingleSpa).not.toHaveBeenCalled();

      // A rejected configuration must not consume the one successful start.
      api.start({ timeout: 100 });
      await loadManualAndRegistered();
      expect(mocks.loadApp.mock.calls.map(([, configuration]) => configuration?.timeout)).toEqual([100, 100]);
      expect(mocks.startSingleSpa).toHaveBeenCalledOnce();
    },
  );
});
