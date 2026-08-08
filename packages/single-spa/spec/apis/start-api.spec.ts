import { registerApplication } from '../../src/single-spa';

describe('start()', () => {
  beforeAll(() => {
    vi.useFakeTimers({ legacyFakeTimers: true });
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  it(`does not throw an error before start() is called`, async () => {
    vi.spyOn(console, 'warn');

    vi.advanceTimersByTime(5000);
    expect(console.warn).not.toHaveBeenCalled();

    registerApplication({
      name: 'app1',
      app: {
        async mount() {},
        async unmount() {},
      },
      activeWhen: '/',
    });
    vi.advanceTimersByTime(5000);

    expect(console.warn).toHaveBeenCalled();
    console.warn.mockRestore();
  });
});
