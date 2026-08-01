import * as singleSpa from "single-spa";

const activeHash = "#no-object-prototype";

describe(`no-object-prototype app`, () => {
  let myApp;

  beforeAll(() => {
    // ES Modules don't have the Object prototype, but should still work as applications
    const app = Object.create(null);
    app.init = async function () {};
    app.mount = async function () {};
    app.unmount = async function () {};

    singleSpa.registerApplication({
      name: "no-object-prototype",
      app,
      activeWhen: (location) => location.hash === activeHash,
    });

    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";
  });

  it(`works when the application doesn't have the Object prototype`, async () => {
    expect(singleSpa.getAppStatus("no-object-prototype")).toBe(
      singleSpa.AppOrParcelStatus.NOT_LOADED,
    );

    location.hash = activeHash;

    await singleSpa.triggerAppChange();

    expect(singleSpa.getAppStatus("no-object-prototype")).toBe(
      singleSpa.AppOrParcelStatus.MOUNTED,
    );
  });
});
