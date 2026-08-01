import * as singleSpa from "single-spa";

const dummyApp1 = {
  init() {
    return Promise.resolve();
  },
  mount() {
    return Promise.resolve();
  },
  unmount() {
    return Promise.resolve();
  },
  unload() {
    return Promise.resolve();
  },
};

const dummyApp2 = {
  init() {
    return Promise.resolve();
  },
  mount() {
    return Promise.resolve();
  },
  unmount() {
    return Promise.resolve();
  },
  unload() {
    return Promise.resolve();
  },
};

const dummyApp3 = {
  init() {
    return Promise.resolve();
  },
  mount() {
    return Promise.resolve();
  },
  unmount() {
    return Promise.resolve();
  },
  unload() {
    return Promise.resolve();
  },
};

const dummyApp4 = {
  init() {
    return Promise.resolve();
  },
  mount() {
    return Promise.resolve();
  },
  unmount() {
    return Promise.resolve();
  },
  unload() {
    return Promise.resolve();
  },
};

describe(`checkActivityFunctionsApi`, () => {
  beforeAll(() => {
    singleSpa.registerApplication(
      "test1",
      () => Promise.resolve(dummyApp1),
      (location) => location.href.indexOf("one") !== -1,
    );
    singleSpa.registerApplication(
      "test2",
      () => Promise.resolve(dummyApp2),
      (location) => location.href.indexOf("two") !== -1,
    );
    singleSpa.registerApplication({
      name: "test3",
      app: dummyApp3,
      activeWhen: (location) => location.href.indexOf("three") !== -1,
    });
    singleSpa.registerApplication({
      name: "test4",
      app: dummyApp4,
      activeWhen: [
        "/pathname",
        (location) => location.href.indexOf("four") !== -1,
      ],
    });
  });

  it(`uses the window.location by default`, () => {
    window.location.hash = "#one";
    expect(singleSpa.checkActivityFunctions()).toEqual(["test1"]);
  });

  it(`returns 'test1' when the location contains 'one'`, () => {
    const wLocation = mockWindowLocation("http://google.com/one");
    expect(singleSpa.checkActivityFunctions(wLocation)).toEqual(["test1"]);
  });

  it(`returns 'test2' when the location contains 'two'`, () => {
    const wLocation = mockWindowLocation("http://google.com/two");
    expect(singleSpa.checkActivityFunctions(wLocation)).toEqual(["test2"]);
  });

  it(`returns 'test3' when the location contains 'three'`, () => {
    const wLocation = mockWindowLocation("http://google.com/three");
    expect(singleSpa.checkActivityFunctions(wLocation)).toEqual(["test3"]);
  });

  it(`returns 'test4' when the location contains 'four'`, () => {
    const wLocation = mockWindowLocation("http://google.com/four");
    expect(singleSpa.checkActivityFunctions(wLocation)).toEqual(["test4"]);
  });

  it(`returns 'test4' when the activeWhen contains 'pathname' strings`, () => {
    const wLocation = mockWindowLocation("http://google.com/pathname");
    expect(singleSpa.checkActivityFunctions(wLocation)).toEqual(["test4"]);
    const wLocationWithTrailingSlash = mockWindowLocation(
      "http://google.com/pathname/",
    );
    expect(
      singleSpa.checkActivityFunctions(wLocationWithTrailingSlash),
    ).toEqual(["test4"]);
  });

  it(`returns both when the location contains all`, () => {
    const wLocation = mockWindowLocation(
      "http://something.com/two/one/three/four",
    );
    expect(singleSpa.checkActivityFunctions(wLocation)).toEqual([
      "test1",
      "test2",
      "test3",
      "test4",
    ]);
  });
});

function mockWindowLocation(url) {
  return new URL(url);
}
