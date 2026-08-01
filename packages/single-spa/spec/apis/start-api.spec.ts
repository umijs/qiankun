import { registerApplication } from "../../src/single-spa";

describe("start()", () => {
  beforeAll(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it(`does not throw an error before start() is called`, async () => {
    jest.spyOn(console, "warn");

    jest.advanceTimersByTime(5000);
    expect(console.warn).not.toHaveBeenCalled();

    registerApplication({
      name: "app1",
      app: {
        async mount() {},
        async unmount() {},
      },
      activeWhen: "/",
    });
    jest.advanceTimersByTime(5000);

    expect(console.warn).toHaveBeenCalled();
    console.warn.mockRestore();
  });
});
