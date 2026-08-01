import * as singleSpa from "single-spa";

describe(`urlRerouteOnly default value`, () => {
  it(`sets urlreroute only to true by default`, async () => {
    singleSpa.start();

    singleSpa.navigateToUrl("/");
    await singleSpa.triggerAppChange();

    let numPopstates = 0;
    const popstateListener = () => numPopstates++;
    window.addEventListener("popstate", popstateListener);

    expect(numPopstates).toBe(0);
    history.pushState(history.state, "", "/");
    await singleSpa.triggerAppChange();
    expect(numPopstates).toBe(0);

    window.removeEventListener("popstate", popstateListener);
  });
});
