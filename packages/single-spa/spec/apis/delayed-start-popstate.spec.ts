import { start, triggerAppChange } from "single-spa";

describe(`delayed-start-popstate`, () => {
  let numPopstates = 0;

  function popstateListener(evt) {
    if (evt.singleSpa) {
      numPopstates++;
    }
  }

  beforeAll(() => {
    history.pushState(history.state, document.title, "/");
  });

  beforeEach(() => {
    numPopstates = 0;
    window.addEventListener("popstate", popstateListener);
  });

  afterEach(() => {
    window.removeEventListener("popstate", popstateListener);
  });

  it(`fires artificial popstate events only after start() is called`, async () => {
    await triggerAppChange();
    expect(numPopstates).toBe(0);

    history.pushState(history.state, document.title, "/delayed1");
    await triggerAppChange();

    expect(numPopstates).toBe(0);

    start();

    await triggerAppChange();
    expect(numPopstates).toBe(0);

    history.pushState(history.state, document.title, "/delayed2");
    await triggerAppChange();

    expect(numPopstates).toBe(1);
  });
});
