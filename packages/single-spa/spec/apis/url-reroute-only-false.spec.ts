import * as singleSpa from "single-spa";

describe(`urlRerouteOnly option`, () => {
  it(`Triggers a reroute and popstate when urlReroute is set to false`, async () => {
    singleSpa.start({
      urlRerouteOnly: false,
    });

    singleSpa.navigateToUrl("/");
    await singleSpa.triggerAppChange();

    let numPopstates = 0;
    const popstateListener = () => numPopstates++;
    window.addEventListener("popstate", popstateListener);

    expect(numPopstates).toBe(0);
    history.pushState(history.state, "", "/");
    await singleSpa.triggerAppChange();
    expect(numPopstates).toBe(1);

    window.removeEventListener("popstate", popstateListener);
  });
});
