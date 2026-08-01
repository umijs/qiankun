import { navigateToUrl } from "../../src/single-spa";

// https://github.com/single-spa/single-spa/pull/826#discussion_r664713545
describe("singleSpaNavigate() before patchHistoryApi()", () => {
  it(`doesn't throw an error when a navigation is canceled`, async () => {
    window.addEventListener(
      "single-spa:before-routing-event",
      cancelTheNavigation,
    );

    navigateToUrl("/other-url");
    await Promise.resolve();

    function cancelTheNavigation(evt) {
      evt.detail.cancelNavigation();
      window.removeEventListener(
        "single-spa:before-routing-event",
        cancelTheNavigation,
      );
    }
  });
});
