import * as singleSpa from "single-spa";

describe(`event listeners before single-spa is started :`, () => {
  beforeEach(ensureCleanSlate);

  it(`calls hashchange and popstate event listeners even when single-spa is not started`, (done) => {
    let hashchangeCalled = false,
      popstateCalled = false;

    function hashchange() {
      if (window.location.hash === "#/a-new-hash") hashchangeCalled = true;

      checkTestComplete();
    }

    function popstate() {
      if (window.location.hash === "#/a-new-hash") popstateCalled = true;

      checkTestComplete();
    }

    window.addEventListener("hashchange", hashchange);
    window.addEventListener("popstate", popstate);

    window.location.hash = "#/a-new-hash";

    function checkTestComplete() {
      if (isIE()) {
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/3740423/
        cleanupAndFinish();
      } else if (hashchangeCalled && popstateCalled) {
        // Wait for both hashchange and popstate events
        cleanupAndFinish();
      }
    }

    function cleanupAndFinish() {
      window.removeEventListener("hashchange", hashchange);
      window.removeEventListener("popstate", popstate);
      done();
    }
  });
});

describe(`event listeners after single-spa is started`, () => {
  beforeAll(() => {
    singleSpa.start();
  });

  beforeEach(ensureCleanSlate);

  it(`calls all of the enqueued hashchange listeners even when the first event given to singleSpa is a popstate event`, (done) => {
    let hashchangeCalled = false,
      popstateCalled = false;

    function hashchange() {
      hashchangeCalled = true;
      checkTestComplete();
    }

    function popstate() {
      popstateCalled = true;
      checkTestComplete();
    }

    window.addEventListener("hashchange", hashchange);
    window.addEventListener("popstate", popstate);

    /* This will first trigger a PopStateEvent, and then a HashChangeEvent. The
     * hashchange event will be queued and not actually given to any event listeners
     * until single-spa is sure that those event listeners won't screw anything up.
     * The bug described in https://github.com/single-spa/single-spa/issues/74 explains
     * why this test is necessary.
     */
    window.location.hash = "#/a-hash-single-spa-is-started";

    function checkTestComplete() {
      if (isIE()) {
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/3740423/
        cleanupAndFinish(); // popstate isn't ever going to be called
      } else if (hashchangeCalled && popstateCalled) {
        // Wait for both hashchange and popstate events
        cleanupAndFinish();
      }
    }

    function cleanupAndFinish() {
      window.removeEventListener("hashchange", hashchange);
      window.removeEventListener("popstate", popstate);
      done();
    }
  });

  /* This regression tests a bug fix. The bug was that single-spa used to removeEventListener by checking if functions' toString() resulted in the
   * same string. In (at least) Chrome, this is problematic because you whenever you do fn.bind(null), the fn.toString() turns into
   * `function() { [native code] }`. So if you have multiple hashchange/popstate listeners that are bound functions, then when you call removeEventListener
   * on one of the bound functions, it will remove all of the bound functions so that they are no longer listening to the hashchange or popstate events.
   *
   * This test ensures that single-spa is checking triple equals equality instead of string equality when comparing functions to removeEventListener
   */
  it(`window.removeEventListener only removes exactly one event listener, which must === the originally added listener. Even if the listener is a bound function`, (done) => {
    const boundListener1 = listener1.bind(null);
    const boundListener2 = listener2.bind(null);

    window.addEventListener("hashchange", boundListener1);
    window.addEventListener("hashchange", boundListener2);

    window.removeEventListener("hashchange", boundListener1);

    // This should trigger listener2 to be called
    window.location.hash = `#/nowhere`;

    function listener1() {
      fail("listener1 should not be called, since it was removed");
    }

    function listener2() {
      window.removeEventListener("hashchange", boundListener2); // cleanup after ourselves
      done();
    }
  });

  it(`Fires artificial popstate events with correct target`, async () => {
    history.pushState(history.state, "", "/");
    await singleSpa.triggerAppChange();

    let finish,
      popstatePromise = new Promise((resolve) => (finish = resolve));
    window.addEventListener("popstate", popstateListener);
    history.pushState(history.state, "", "/new-url");
    await popstatePromise;

    function popstateListener(evt) {
      expect(evt.target).toBe(window);
      window.removeEventListener("popstate", popstateListener);
      finish();
    }
  });
});

function ensureCleanSlate() {
  /* First we need to make sure we have a clean slate where single-spa is not queueing up events or app changes.
   * Otherwise, the event listeners might be called because of a different spec that causes hashchange and popstate
   * events
   */
  return singleSpa.triggerAppChange();
}

function isIE() {
  return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
}
