import * as singleSpa from "single-spa";
import * as app from "./init-prioritized-over-bootstrap.app";

describe(`init-prioritized-over-bootstrap`, () => {
  it(`calls the init lifecycle rather than bootstrap`, async () => {
    singleSpa.registerApplication({
      name: "legacy-bootstrap",
      app,
      activeWhen: ["/"],
    });

    singleSpa.start();

    await singleSpa.triggerAppChange();

    expect(app.bootstrapCalled).toBe(false);
    expect(app.initCalled).toBe(true);
  });
});
