const singleSpa = require("single-spa");

describe(`nodejs spec`, () => {
  describe("activity functions", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("can still check activity functions in nodejs with a mocked Location object", () => {
      singleSpa.registerApplication(
        "app1",
        /* Note that on the server, System is likely undefined. But this is okay and doesn't cause problems
         * because single-spa doesn't call the loading functions when checking activity functions
         */
        () => System.import("app1"),
        (location) => location.pathname.startsWith("/app1"),
      );
      singleSpa.registerApplication(
        "app2",
        () => System.import("app2"),
        (location) => location.pathname.startsWith("/app2"),
      );
      singleSpa.registerApplication(
        "navbar",
        () => System.import("navbar"),
        (location) => true,
      );

      expect(singleSpa.checkActivityFunctions({ pathname: "/app1" })).toEqual([
        "app1",
        "navbar",
      ]);
      expect(singleSpa.checkActivityFunctions({ pathname: "/app2" })).toEqual([
        "app2",
        "navbar",
      ]);
      expect(singleSpa.checkActivityFunctions({ pathname: "/app3" })).toEqual([
        "navbar",
      ]);
    });

    it("doesn't die if you call singleSpa.start()", () => {
      singleSpa.start();
    });
  });
});
