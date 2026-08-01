import * as singleSpa from "single-spa";

describe("registerApplication", function () {
  let app;
  let errorsMessages = {
    invalidConfig: "Configuration object can't be an Array or null!",
    name: {
      args: "The 1st argument to registerApplication must be a non-empty string 'appName'",
      config:
        "The config.name on registerApplication must be a non-empty string",
    },
    app: {
      args: "The 2nd argument to registerApplication must be an application or loading application function",
      config:
        "The config.app on registerApplication must be an application or a loading function",
    },
    activeWhen: {
      args: "The 3rd argument to registerApplication must be an activeWhen function",
      config:
        "The config.activeWhen on registerApplication must be a string, function or an array with both",
    },
    customProps: {
      args: "The optional 4th argument is a customProps and must be an object",
      config: "The optional config.customProps must be an object",
    },
    duplicateApp: "There is already an app registered with name",
  };
  beforeEach(() => {
    app = {
      mount() {
        return Promise.resolve();
      },
      unmount() {
        return Promise.resolve();
      },
      init() {
        return Promise.resolve();
      },
    };
  });

  describe(`Application name errors`, () => {
    it(`should throw an error if the name isn't a non empty string`, () => {
      expect(() => {
        singleSpa.registerApplication(null);
      }).toThrowError(errorsMessages.name.invalidConfig);
      expect(() => {
        singleSpa.registerApplication();
      }).toThrowError(errorsMessages.name.args);
      expect(() => {
        singleSpa.registerApplication("");
      }).toThrowError(errorsMessages.name.args);
      expect(() => {
        singleSpa.registerApplication({ name: null });
      }).toThrowError(errorsMessages.name.config);
      expect(() => {
        singleSpa.registerApplication({ name: "" });
      }).toThrowError(errorsMessages.name.config);
      expect(() => {
        singleSpa.registerApplication({});
      }).toThrowError(errorsMessages.name.config);
    });

    it("should throw when I register the same application name twice", () => {
      singleSpa.registerApplication("duplicateApp", app, () => true);
      expect(() => {
        singleSpa.registerApplication("duplicateApp", app, () => true);
      }).toThrowError(errorsMessages.duplicateApp);
    });

    it("should throw when I register the same application name twice using config", () => {
      singleSpa.registerApplication({
        name: "duplicateUsingConfigApp",
        app,
        activeWhen: () => true,
      });
      expect(() => {
        singleSpa.registerApplication({
          name: "duplicateUsingConfigApp",
          app,
          activeWhen: () => true,
        });
      }).toThrowError(errorsMessages.duplicateApp);
    });
  });

  describe(`application or loading function errors`, () => {
    it(`should throw an error when I attempt to register an application without the application or loading function`, () => {
      expect(() => {
        singleSpa.registerApplication("no-app-will-throw-error-app");
      }).toThrowError(errorsMessages.app.args);
      expect(() => {
        singleSpa.registerApplication({ name: "no-app-will-throw-error-app" });
      }).toThrowError(errorsMessages.app.config);
    });
  });

  describe(`activeWhen errors`, () => {
    it(`should throw an error when I attempt to register an application without the activeWhen function`, () => {
      expect(() => {
        singleSpa.registerApplication("no-active-when-throw-error-app", app);
      }).toThrowError(errorsMessages.activeWhen.args);
      expect(() => {
        singleSpa.registerApplication({
          name: "no-active-when-throw-error-app",
          app,
        });
      }).toThrowError(errorsMessages.activeWhen.config);
    });

    it(`should throw an error when activeWhen isn't a function`, () => {
      expect(() => {
        singleSpa.registerApplication(
          "bad-active-when-args-throw-error-app",
          app,
          app,
        );
      }).toThrowError(errorsMessages.activeWhen.args);
      expect(() => {
        singleSpa.registerApplication({
          name: "bad-active-when-config-throw-error-app",
          app,
          activeWhen: app,
        });
      }).toThrowError(errorsMessages.activeWhen.config);
    });

    it(`should throw an error when activeWhen is given not a function`, () => {
      expect(() => {
        singleSpa.registerApplication("bad-active-when-throw-error-app", app, [
          "/valid-only-in-object-config",
        ]);
      }).toThrowError(errorsMessages.activeWhen.args);
      expect(() => {
        singleSpa.registerApplication(
          "bad-active-when-throw-error-app",
          app,
          "/valid-only-in-object-config",
        );
      }).toThrowError(errorsMessages.activeWhen.args);
      expect(() => {
        singleSpa.registerApplication({
          name: "bad-active-when-throw-error-app",
          app,
          activeWhen: ["/valid", true],
        });
      }).toThrowError(errorsMessages.activeWhen.config);
    });

    it(`should succeed when activeWhen is given correct values`, () => {
      expect(() => {
        singleSpa.registerApplication({
          name: "valid-active-when-single-throw-error-app",
          app,
          activeWhen: () => true,
        });
      }).not.toThrow();
      expect(() => {
        singleSpa.registerApplication({
          name: "valid-active-when-multiple-throw-error-app",
          app,
          activeWhen: ["/valid", () => true],
        });
      }).not.toThrow();
    });
  });

  describe(`custom prop errors`, () => {
    it("should succeed when I pass in a function for custom props", () => {
      expect(() => {
        singleSpa.registerApplication(
          "custom-props-fn-1",
          app,
          () => true,
          () => {},
        );
      }).not.toThrow();
      expect(() => {
        singleSpa.registerApplication({
          name: "custom-props-fn-2",
          app,
          activeWhen: () => true,
          customProps: () => {},
        });
      }).not.toThrow();
    });

    it("should throw when I pass in an array for custom props", () => {
      expect(() => {
        singleSpa.registerApplication(
          "bad-custom-props-will-throw-error-app",
          app,
          () => true,
          [],
        );
      }).toThrowError(errorsMessages.customProps.args);
      expect(() => {
        singleSpa.registerApplication({
          name: "bad-custom-props-will-throw-error-app",
          app,
          activeWhen: () => true,
          customProps: [],
        });
      }).toThrowError(errorsMessages.customProps.config);
    });

    it("should throw when I pass invalid keys to object configuration ", () => {
      expect(() => {
        singleSpa.registerApplication({
          name: "invalid-key-in-object-config",
          app,
          activeWhen: () => true,
          invalidKey: "invalidKey",
          superInvalidKey: {},
        });
      }).toThrowError("Invalid keys: invalidKey, superInvalidKey.");
    });
  });
});
