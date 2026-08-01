import { navigateToUrl, patchHistoryApi } from "../../src/single-spa";

describe("patchHistoryApi", () => {
  it(`patches the history api only once`, async () => {
    navigateToUrl("/");
    let numPopstates = 0;

    window.addEventListener("popstate", popstateListener);

    navigateToUrl("/a");
    await tick();
    expect(numPopstates).toEqual(0);

    history.pushState(history.state, "", "/");
    await tick();
    expect(numPopstates).toEqual(0);

    patchHistoryApi();

    navigateToUrl("/b");
    await tick();
    expect(numPopstates).toEqual(1);

    history.pushState(history.state, "", "/c");
    await tick();
    expect(numPopstates).toEqual(2);

    window.removeEventListener("popstate", popstateListener);

    expect(patchHistoryApi).toThrowError(
      "was called after the history api was already patched",
    );

    function popstateListener() {
      numPopstates++;
    }
  });
});

function tick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 10);
  });
}
