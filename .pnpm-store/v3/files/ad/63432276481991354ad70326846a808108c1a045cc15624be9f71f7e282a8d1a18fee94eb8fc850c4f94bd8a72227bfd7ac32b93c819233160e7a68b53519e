/* single-spa@6.0.0-beta.3 - SystemJS ES5 - dev */
System.register([], function (exports) {
  'use strict';
  return {
    execute: function () {

      exports({
        addErrorHandler: addErrorHandler,
        checkActivityFunctions: checkActivityFunctions,
        ensureJQuerySupport: ensureJQuerySupport,
        getAppNames: getAppNames,
        getAppStatus: getAppStatus,
        getMountedApps: getMountedApps,
        getProfilerData: getProfilerData,
        mountRootParcel: mountRootParcel,
        navigateToUrl: navigateToUrl,
        patchHistoryApi: patchHistoryApi,
        pathToActiveWhen: pathToActiveWhen,
        registerApplication: registerApplication,
        removeErrorHandler: removeErrorHandler,
        setBootstrapMaxTime: setBootstrapMaxTime,
        setMountMaxTime: setMountMaxTime,
        setUnloadMaxTime: setUnloadMaxTime,
        setUnmountMaxTime: setUnmountMaxTime,
        start: start,
        triggerAppChange: triggerAppChange,
        unloadApplication: unloadApplication,
        unregisterApplication: unregisterApplication
      });

      var singleSpa = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get start () { return start; },
        get ensureJQuerySupport () { return ensureJQuerySupport; },
        get setBootstrapMaxTime () { return setBootstrapMaxTime; },
        get setMountMaxTime () { return setMountMaxTime; },
        get setUnmountMaxTime () { return setUnmountMaxTime; },
        get setUnloadMaxTime () { return setUnloadMaxTime; },
        get registerApplication () { return registerApplication; },
        get unregisterApplication () { return unregisterApplication; },
        get getMountedApps () { return getMountedApps; },
        get getAppStatus () { return getAppStatus; },
        get unloadApplication () { return unloadApplication; },
        get checkActivityFunctions () { return checkActivityFunctions; },
        get getAppNames () { return getAppNames; },
        get pathToActiveWhen () { return pathToActiveWhen; },
        get navigateToUrl () { return navigateToUrl; },
        get patchHistoryApi () { return patchHistoryApi; },
        get triggerAppChange () { return triggerAppChange; },
        get addErrorHandler () { return addErrorHandler; },
        get removeErrorHandler () { return removeErrorHandler; },
        get mountRootParcel () { return mountRootParcel; },
        get NOT_LOADED () { return NOT_LOADED; },
        get LOADING_SOURCE_CODE () { return LOADING_SOURCE_CODE; },
        get NOT_BOOTSTRAPPED () { return NOT_BOOTSTRAPPED; },
        get BOOTSTRAPPING () { return BOOTSTRAPPING; },
        get NOT_MOUNTED () { return NOT_MOUNTED; },
        get MOUNTING () { return MOUNTING; },
        get UPDATING () { return UPDATING; },
        get LOAD_ERROR () { return LOAD_ERROR; },
        get MOUNTED () { return MOUNTED; },
        get UNMOUNTING () { return UNMOUNTING; },
        get SKIP_BECAUSE_BROKEN () { return SKIP_BECAUSE_BROKEN; }
      });

      function _typeof(obj) {
        "@babel/helpers - typeof";

        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function (obj) {
            return typeof obj;
          };
        } else {
          _typeof = function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
        }

        return _typeof(obj);
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }

        return obj;
      }

      var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

      var NativeCustomEvent = commonjsGlobal.CustomEvent;

      function useNative () {
        try {
          var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
          return  'cat' === p.type && 'bar' === p.detail.foo;
        } catch (e) {
        }
        return false;
      }

      /**
       * Cross-browser `CustomEvent` constructor.
       *
       * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
       *
       * @public
       */

      var customEvent = useNative() ? NativeCustomEvent :

      // IE >= 9
      'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent (type, params) {
        var e = document.createEvent('CustomEvent');
        if (params) {
          e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
        } else {
          e.initCustomEvent(type, false, false, void 0);
        }
        return e;
      } :

      // IE <= 8
      function CustomEvent (type, params) {
        var e = document.createEventObject();
        e.type = type;
        if (params) {
          e.bubbles = Boolean(params.bubbles);
          e.cancelable = Boolean(params.cancelable);
          e.detail = params.detail;
        } else {
          e.bubbles = false;
          e.cancelable = false;
          e.detail = void 0;
        }
        return e;
      };

      var errorHandlers = [];
      function handleAppError(err, app, newStatus) {
        var transformedErr = transformErr(err, app, newStatus);

        if (errorHandlers.length) {
          errorHandlers.forEach(function (handler) {
            return handler(transformedErr);
          });
        } else {
          setTimeout(function () {
            throw transformedErr;
          });
        }
      }
      function addErrorHandler(handler) {
        if (typeof handler !== "function") {
          throw Error(formatErrorMessage(28, "a single-spa error handler must be a function"));
        }

        errorHandlers.push(handler);
      }
      function removeErrorHandler(handler) {
        if (typeof handler !== "function") {
          throw Error(formatErrorMessage(29, "a single-spa error handler must be a function"));
        }

        var removedSomething = false;
        errorHandlers = errorHandlers.filter(function (h) {
          var isHandler = h === handler;
          removedSomething = removedSomething || isHandler;
          return !isHandler;
        });
        return removedSomething;
      }
      function formatErrorMessage(code, msg) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        return "single-spa minified message #".concat(code, ": ").concat(msg ? msg + " " : "", "See https://single-spa.js.org/error/?code=").concat(code).concat(args.length ? "&arg=".concat(args.join("&arg=")) : "");
      }
      function transformErr(ogErr, appOrParcel, newStatus) {
        var errPrefix = "".concat(objectType(appOrParcel), " '").concat(toName(appOrParcel), "' died in status ").concat(appOrParcel.status, ": ");
        var result;

        if (ogErr instanceof Error) {
          try {
            ogErr.message = errPrefix + ogErr.message;
          } catch (err) {
            /* Some errors have read-only message properties, in which case there is nothing
             * that we can do.
             */
          }

          result = ogErr;
        } else {
          console.warn(formatErrorMessage(30, "While ".concat(appOrParcel.status, ", '").concat(toName(appOrParcel), "' rejected its lifecycle function promise with a non-Error. This will cause stack traces to not be accurate."), appOrParcel.status, toName(appOrParcel)));

          try {
            result = Error(errPrefix + JSON.stringify(ogErr));
          } catch (err) {
            // If it's not an Error and you can't stringify it, then what else can you even do to it?
            result = ogErr;
          }
        }

        result.appOrParcelName = toName(appOrParcel); // We set the status after transforming the error so that the error message
        // references the state the application was in before the status change.

        appOrParcel.status = newStatus;
        return result;
      }

      var NOT_LOADED = exports('NOT_LOADED', "NOT_LOADED");
      var LOADING_SOURCE_CODE = exports('LOADING_SOURCE_CODE', "LOADING_SOURCE_CODE");
      var NOT_BOOTSTRAPPED = exports('NOT_BOOTSTRAPPED', "NOT_BOOTSTRAPPED");
      var BOOTSTRAPPING = exports('BOOTSTRAPPING', "BOOTSTRAPPING");
      var NOT_MOUNTED = exports('NOT_MOUNTED', "NOT_MOUNTED");
      var MOUNTING = exports('MOUNTING', "MOUNTING");
      var MOUNTED = exports('MOUNTED', "MOUNTED");
      var UPDATING = exports('UPDATING', "UPDATING");
      var UNMOUNTING = exports('UNMOUNTING', "UNMOUNTING");
      var UNLOADING = "UNLOADING";
      var LOAD_ERROR = exports('LOAD_ERROR', "LOAD_ERROR");
      var SKIP_BECAUSE_BROKEN = exports('SKIP_BECAUSE_BROKEN', "SKIP_BECAUSE_BROKEN");
      function isActive(app) {
        return app.status === MOUNTED;
      }
      function shouldBeActive(app) {
        try {
          return app.activeWhen(window.location);
        } catch (err) {
          handleAppError(err, app, SKIP_BECAUSE_BROKEN);
          return false;
        }
      }
      function toName(app) {
        return app.name;
      }
      function isParcel(appOrParcel) {
        return Boolean(appOrParcel.unmountThisParcel);
      }
      function objectType(appOrParcel) {
        return isParcel(appOrParcel) ? "parcel" : "application";
      }

      // Object.assign() is not available in IE11. And the babel compiled output for object spread
      // syntax checks a bunch of Symbol stuff and is almost a kb. So this function is the smaller replacement.
      function assign() {
        for (var i = arguments.length - 1; i > 0; i--) {
          for (var key in arguments[i]) {
            if (key === "__proto__") {
              continue;
            }

            arguments[i - 1][key] = arguments[i][key];
          }
        }

        return arguments[0];
      }

      /* the array.prototype.find polyfill on npmjs.com is ~20kb (not worth it)
       * and lodash is ~200kb (not worth it)
       */
      function find(arr, func) {
        for (var i = 0; i < arr.length; i++) {
          if (func(arr[i])) {
            return arr[i];
          }
        }

        return null;
      }

      function validLifecycleFn(fn) {
        return fn && (typeof fn === "function" || isArrayOfFns(fn));

        function isArrayOfFns(arr) {
          return Array.isArray(arr) && !find(arr, function (item) {
            return typeof item !== "function";
          });
        }
      }
      function flattenFnArray(appOrParcel, lifecycle) {
        var fns = appOrParcel[lifecycle] || [];
        fns = Array.isArray(fns) ? fns : [fns];

        if (fns.length === 0) {
          fns = [function () {
            return Promise.resolve();
          }];
        }

        var type = objectType(appOrParcel);
        var name = toName(appOrParcel);
        return function (props) {
          return fns.reduce(function (resultPromise, fn, index) {
            return resultPromise.then(function () {
              var thisPromise = fn(props);
              return smellsLikeAPromise(thisPromise) ? thisPromise : Promise.reject(formatErrorMessage(15, "Within ".concat(type, " ").concat(name, ", the lifecycle function ").concat(lifecycle, " at array index ").concat(index, " did not return a promise"), type, name, lifecycle, index));
            });
          }, Promise.resolve());
        };
      }
      function smellsLikeAPromise(promise) {
        return promise && typeof promise.then === "function" && typeof promise.catch === "function";
      }

      var profileEntries = [];
      function getProfilerData() {
        return profileEntries;
      }
      /**
       *
       * @type {'application' | 'parcel' | 'routing'} ProfileType
       *
       * @param {ProfileType} type
       * @param {String} name
       * @param {number} start
       * @param {number} end
       */

      function addProfileEntry(type, name, kind, start, end, operationSucceeded) {
        profileEntries.push({
          type: type,
          name: name,
          start: start,
          end: end,
          kind: kind,
          operationSucceeded: operationSucceeded
        });
      }

      function toBootstrapPromise(appOrParcel, hardFail) {
        var startTime, profileEventType;
        return Promise.resolve().then(function () {
          if (appOrParcel.status !== NOT_BOOTSTRAPPED) {
            return appOrParcel;
          }

          {
            profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
            startTime = performance.now();
          }

          appOrParcel.status = BOOTSTRAPPING;

          if (!appOrParcel.bootstrap) {
            // Default implementation of bootstrap
            return Promise.resolve().then(successfulBootstrap);
          }

          return reasonableTime(appOrParcel, "bootstrap").then(successfulBootstrap).catch(function (err) {
            {
              addProfileEntry(profileEventType, toName(appOrParcel), "bootstrap", startTime, performance.now(), false);
            }

            if (hardFail) {
              throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
            } else {
              handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
              return appOrParcel;
            }
          });
        });

        function successfulBootstrap() {
          appOrParcel.status = NOT_MOUNTED;

          {
            addProfileEntry(profileEventType, toName(appOrParcel), "bootstrap", startTime, performance.now(), true);
          }

          return appOrParcel;
        }
      }

      function toUnmountPromise(appOrParcel, hardFail) {
        return Promise.resolve().then(function () {
          if (appOrParcel.status !== MOUNTED) {
            return appOrParcel;
          }

          var startTime, profileEventType;

          {
            startTime = performance.now();
            profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
          }

          appOrParcel.status = UNMOUNTING;
          var unmountChildrenParcels = Object.keys(appOrParcel.parcels).map(function (parcelId) {
            return appOrParcel.parcels[parcelId].unmountThisParcel();
          });
          return Promise.all(unmountChildrenParcels).then(unmountAppOrParcel, function (parcelError) {
            // There is a parcel unmount error
            return unmountAppOrParcel().then(function () {
              // Unmounting the app/parcel succeeded, but unmounting its children parcels did not
              var parentError = Error(parcelError.message);

              if (hardFail) {
                throw transformErr(parentError, appOrParcel, SKIP_BECAUSE_BROKEN);
              } else {
                handleAppError(parentError, appOrParcel, SKIP_BECAUSE_BROKEN);
              }
            });
          }).then(function () {
            return appOrParcel;
          });

          function unmountAppOrParcel() {
            // We always try to unmount the appOrParcel, even if the children parcels failed to unmount.
            return reasonableTime(appOrParcel, "unmount").then(function () {
              // The appOrParcel needs to stay in a broken status if its children parcels fail to unmount
              {
                appOrParcel.status = NOT_MOUNTED;
              }

              {
                addProfileEntry(profileEventType, toName(appOrParcel), "unmount", startTime, performance.now(), true);
              }
            }, function (err) {
              {
                addProfileEntry(profileEventType, toName(appOrParcel), "unmount", startTime, performance.now(), false);
              }

              if (hardFail) {
                throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
              } else {
                handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
              }
            });
          }
        });
      }

      var beforeFirstMountFired = false;
      var firstMountFired = false;
      function toMountPromise(appOrParcel, hardFail) {
        return Promise.resolve().then(function () {
          if (appOrParcel.status !== NOT_MOUNTED) {
            return appOrParcel;
          }

          var startTime, profileEventType;

          {
            profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
            startTime = performance.now();
          }

          if (!beforeFirstMountFired) {
            window.dispatchEvent(new customEvent("single-spa:before-first-mount"));
            beforeFirstMountFired = true;
          }

          appOrParcel.status = MOUNTING;
          return reasonableTime(appOrParcel, "mount").then(function () {
            appOrParcel.status = MOUNTED;

            if (!firstMountFired) {
              window.dispatchEvent(new customEvent("single-spa:first-mount"));
              firstMountFired = true;
            }

            {
              addProfileEntry(profileEventType, toName(appOrParcel), "mount", startTime, performance.now(), true);
            }

            return appOrParcel;
          }).catch(function (err) {
            // If we fail to mount the appOrParcel, we should attempt to unmount it before putting in SKIP_BECAUSE_BROKEN
            // We temporarily put the appOrParcel into MOUNTED status so that toUnmountPromise actually attempts to unmount it
            // instead of just doing a no-op.
            appOrParcel.status = MOUNTED;
            return toUnmountPromise(appOrParcel, true).then(setSkipBecauseBroken, setSkipBecauseBroken);

            function setSkipBecauseBroken() {
              {
                addProfileEntry(profileEventType, toName(appOrParcel), "mount", startTime, performance.now(), false);
              }

              if (!hardFail) {
                handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
                return appOrParcel;
              } else {
                throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
              }
            }
          });
        });
      }

      function toUpdatePromise(appOrParcel) {
        return Promise.resolve().then(function () {
          var startTime, profileEventType;

          {
            profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
            startTime = performance.now();
          }

          if (appOrParcel.status !== MOUNTED) {
            throw Error(formatErrorMessage(32, "Cannot update parcel '".concat(toName(appOrParcel), "' because it is not mounted"), toName(appOrParcel)));
          }

          appOrParcel.status = UPDATING;
          return reasonableTime(appOrParcel, "update").then(function () {
            appOrParcel.status = MOUNTED;

            {
              addProfileEntry(profileEventType, toName(appOrParcel), "update", startTime, performance.now(), true);
            }

            return appOrParcel;
          }).catch(function (err) {
            {
              addProfileEntry(profileEventType, toName(appOrParcel), "update", startTime, performance.now(), false);
            }

            throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
          });
        });
      }

      var parcelCount = 0;
      var rootParcels = {
        parcels: {}
      }; // This is a public api, exported to users of single-spa

      function mountRootParcel() {
        return mountParcel.apply(rootParcels, arguments);
      }
      function mountParcel(config, customProps) {
        var owningAppOrParcel = this; // Validate inputs

        if (!config || _typeof(config) !== "object" && typeof config !== "function") {
          throw Error(formatErrorMessage(2, "Cannot mount parcel without a config object or config loading function"));
        }

        if (config.name && typeof config.name !== "string") {
          throw Error(formatErrorMessage(3, "Parcel name must be a string, if provided. Was given ".concat(_typeof(config.name)), _typeof(config.name)));
        }

        var id = parcelCount++;
        var name = config.name || "parcel-".concat(id);

        if (_typeof(customProps) !== "object") {
          throw Error(formatErrorMessage(4, "Parcel ".concat(name, " has invalid customProps -- must be an object but was given ").concat(_typeof(customProps)), name, _typeof(customProps)));
        }

        if (!customProps.domElement) {
          throw Error(formatErrorMessage(5, "Parcel ".concat(name, " cannot be mounted without a domElement provided as a prop"), name));
        }

        var passedConfigLoadingFunction = typeof config === "function";
        var configLoadingFunction = passedConfigLoadingFunction ? config : function () {
          return Promise.resolve(config);
        }; // Internal representation

        var parcel = {
          id: id,
          parcels: {},
          status: passedConfigLoadingFunction ? LOADING_SOURCE_CODE : NOT_BOOTSTRAPPED,
          customProps: customProps,
          parentName: toName(owningAppOrParcel),
          unmountThisParcel: function unmountThisParcel() {
            return mountPromise.then(function () {
              if (parcel.status !== MOUNTED) {
                throw Error(formatErrorMessage(6, "Cannot unmount parcel '".concat(name, "' -- it is in a ").concat(parcel.status, " status"), name, parcel.status));
              }

              return toUnmountPromise(parcel, true);
            }).then(function (value) {
              if (parcel.parentName) {
                delete owningAppOrParcel.parcels[parcel.id];
              }

              return value;
            }).then(function (value) {
              resolveUnmount(value);
              return value;
            }).catch(function (err) {
              parcel.status = SKIP_BECAUSE_BROKEN;
              rejectUnmount(err);
              throw err;
            });
          }
        }; // We return an external representation

        var externalRepresentation; // Add to owning app or parcel

        owningAppOrParcel.parcels[id] = parcel;
        var loadPromise = configLoadingFunction();

        if (!loadPromise || typeof loadPromise.then !== "function") {
          throw Error(formatErrorMessage(7, "When mounting a parcel, the config loading function must return a promise that resolves with the parcel config"));
        }

        loadPromise = loadPromise.then(function (config) {
          if (!config) {
            throw Error(formatErrorMessage(8, "When mounting a parcel, the config loading function returned a promise that did not resolve with a parcel config"));
          }

          name = config.name || "parcel-".concat(id);

          if ( // ES Module objects don't have the object prototype
          Object.prototype.hasOwnProperty.call(config, "bootstrap") && !validLifecycleFn(config.bootstrap)) {
            throw Error(formatErrorMessage(9, "Parcel ".concat(name, " provided an invalid bootstrap function"), name));
          }

          if (!validLifecycleFn(config.mount)) {
            throw Error(formatErrorMessage(10, "Parcel ".concat(name, " must have a valid mount function"), name));
          }

          if (!validLifecycleFn(config.unmount)) {
            throw Error(formatErrorMessage(11, "Parcel ".concat(name, " must have a valid unmount function"), name));
          }

          if (config.update && !validLifecycleFn(config.update)) {
            throw Error(formatErrorMessage(12, "Parcel ".concat(name, " provided an invalid update function"), name));
          }

          var bootstrap = flattenFnArray(config, "bootstrap");
          var mount = flattenFnArray(config, "mount");
          var unmount = flattenFnArray(config, "unmount");
          parcel.status = NOT_BOOTSTRAPPED;
          parcel.name = name;
          parcel.bootstrap = bootstrap;
          parcel.mount = mount;
          parcel.unmount = unmount;
          parcel.timeouts = ensureValidAppTimeouts(config.timeouts);

          if (config.update) {
            parcel.update = flattenFnArray(config, "update");

            externalRepresentation.update = function (customProps) {
              parcel.customProps = customProps;
              return promiseWithoutReturnValue(toUpdatePromise(parcel));
            };
          }
        }); // Start bootstrapping and mounting
        // The .then() causes the work to be put on the event loop instead of happening immediately

        var bootstrapPromise = loadPromise.then(function () {
          return toBootstrapPromise(parcel, true);
        });
        var mountPromise = bootstrapPromise.then(function () {
          return toMountPromise(parcel, true);
        });
        var resolveUnmount, rejectUnmount;
        var unmountPromise = new Promise(function (resolve, reject) {
          resolveUnmount = resolve;
          rejectUnmount = reject;
        });
        externalRepresentation = {
          mount: function mount() {
            return promiseWithoutReturnValue(Promise.resolve().then(function () {
              if (parcel.status !== NOT_MOUNTED) {
                throw Error(formatErrorMessage(13, "Cannot mount parcel '".concat(name, "' -- it is in a ").concat(parcel.status, " status"), name, parcel.status));
              } // Add to owning app or parcel


              owningAppOrParcel.parcels[id] = parcel;
              return toMountPromise(parcel);
            }));
          },
          unmount: function unmount() {
            return promiseWithoutReturnValue(parcel.unmountThisParcel());
          },
          getStatus: function getStatus() {
            return parcel.status;
          },
          loadPromise: promiseWithoutReturnValue(loadPromise),
          bootstrapPromise: promiseWithoutReturnValue(bootstrapPromise),
          mountPromise: promiseWithoutReturnValue(mountPromise),
          unmountPromise: promiseWithoutReturnValue(unmountPromise)
        };
        return externalRepresentation;
      }

      function promiseWithoutReturnValue(promise) {
        return promise.then(function () {
          return null;
        });
      }

      function getProps(appOrParcel) {
        var name = toName(appOrParcel);
        var customProps = typeof appOrParcel.customProps === "function" ? appOrParcel.customProps(name, window.location) : appOrParcel.customProps;

        if (_typeof(customProps) !== "object" || customProps === null || Array.isArray(customProps)) {
          customProps = {};
          console.warn(formatErrorMessage(40, "single-spa: ".concat(name, "'s customProps function must return an object. Received ").concat(customProps)), name, customProps);
        }

        var result = assign({}, customProps, {
          name: name,
          mountParcel: mountParcel.bind(appOrParcel),
          singleSpa: singleSpa
        });

        if (isParcel(appOrParcel)) {
          result.unmountSelf = appOrParcel.unmountThisParcel;
        }

        return result;
      }

      var defaultWarningMillis = 1000;
      var globalTimeoutConfig = {
        bootstrap: {
          millis: 4000,
          dieOnTimeout: false,
          warningMillis: defaultWarningMillis
        },
        mount: {
          millis: 3000,
          dieOnTimeout: false,
          warningMillis: defaultWarningMillis
        },
        unmount: {
          millis: 3000,
          dieOnTimeout: false,
          warningMillis: defaultWarningMillis
        },
        unload: {
          millis: 3000,
          dieOnTimeout: false,
          warningMillis: defaultWarningMillis
        },
        update: {
          millis: 3000,
          dieOnTimeout: false,
          warningMillis: defaultWarningMillis
        }
      };
      function setBootstrapMaxTime(time, dieOnTimeout, warningMillis) {
        if (typeof time !== "number" || time <= 0) {
          throw Error(formatErrorMessage(16, "bootstrap max time must be a positive integer number of milliseconds"));
        }

        globalTimeoutConfig.bootstrap = {
          millis: time,
          dieOnTimeout: dieOnTimeout,
          warningMillis: warningMillis || defaultWarningMillis
        };
      }
      function setMountMaxTime(time, dieOnTimeout, warningMillis) {
        if (typeof time !== "number" || time <= 0) {
          throw Error(formatErrorMessage(17, "mount max time must be a positive integer number of milliseconds"));
        }

        globalTimeoutConfig.mount = {
          millis: time,
          dieOnTimeout: dieOnTimeout,
          warningMillis: warningMillis || defaultWarningMillis
        };
      }
      function setUnmountMaxTime(time, dieOnTimeout, warningMillis) {
        if (typeof time !== "number" || time <= 0) {
          throw Error(formatErrorMessage(18, "unmount max time must be a positive integer number of milliseconds"));
        }

        globalTimeoutConfig.unmount = {
          millis: time,
          dieOnTimeout: dieOnTimeout,
          warningMillis: warningMillis || defaultWarningMillis
        };
      }
      function setUnloadMaxTime(time, dieOnTimeout, warningMillis) {
        if (typeof time !== "number" || time <= 0) {
          throw Error(formatErrorMessage(19, "unload max time must be a positive integer number of milliseconds"));
        }

        globalTimeoutConfig.unload = {
          millis: time,
          dieOnTimeout: dieOnTimeout,
          warningMillis: warningMillis || defaultWarningMillis
        };
      }
      function reasonableTime(appOrParcel, lifecycle) {
        var timeoutConfig = appOrParcel.timeouts[lifecycle];
        var warningPeriod = timeoutConfig.warningMillis;
        var type = objectType(appOrParcel);
        return new Promise(function (resolve, reject) {
          var finished = false;
          var errored = false;
          appOrParcel[lifecycle](getProps(appOrParcel)).then(function (val) {
            finished = true;
            resolve(val);
          }).catch(function (val) {
            finished = true;
            reject(val);
          });
          setTimeout(function () {
            return maybeTimingOut(1);
          }, warningPeriod);
          setTimeout(function () {
            return maybeTimingOut(true);
          }, timeoutConfig.millis);
          var errMsg = formatErrorMessage(31, "Lifecycle function ".concat(lifecycle, " for ").concat(type, " ").concat(toName(appOrParcel), " lifecycle did not resolve or reject for ").concat(timeoutConfig.millis, " ms."), lifecycle, type, toName(appOrParcel), timeoutConfig.millis);

          function maybeTimingOut(shouldError) {
            if (!finished) {
              if (shouldError === true) {
                errored = true;

                if (timeoutConfig.dieOnTimeout) {
                  reject(Error(errMsg));
                } else {
                  console.error(errMsg); //don't resolve or reject, we're waiting this one out
                }
              } else if (!errored) {
                var numWarnings = shouldError;
                var numMillis = numWarnings * warningPeriod;
                console.warn(errMsg);

                if (numMillis + warningPeriod < timeoutConfig.millis) {
                  setTimeout(function () {
                    return maybeTimingOut(numWarnings + 1);
                  }, warningPeriod);
                }
              }
            }
          }
        });
      }
      function ensureValidAppTimeouts(timeouts) {
        var result = {};

        for (var key in globalTimeoutConfig) {
          result[key] = assign({}, globalTimeoutConfig[key], timeouts && timeouts[key] || {});
        }

        return result;
      }

      function toLoadPromise(appOrParcel) {
        return Promise.resolve().then(function () {
          if (appOrParcel.loadPromise) {
            return appOrParcel.loadPromise;
          }

          if (appOrParcel.status !== NOT_LOADED && appOrParcel.status !== LOAD_ERROR) {
            return appOrParcel;
          }

          var startTime;

          {
            startTime = performance.now();
          }

          appOrParcel.status = LOADING_SOURCE_CODE;
          var appOpts, isUserErr;
          return appOrParcel.loadPromise = Promise.resolve().then(function () {
            var loadPromise = appOrParcel.loadApp(getProps(appOrParcel));

            if (!smellsLikeAPromise(loadPromise)) {
              // The name of the app will be prepended to this error message inside of the handleAppError function
              isUserErr = true;
              throw Error(formatErrorMessage(33, "single-spa loading function did not return a promise. Check the second argument to registerApplication('".concat(toName(appOrParcel), "', loadingFunction, activityFunction)"), toName(appOrParcel)));
            }

            return loadPromise.then(function (val) {
              appOrParcel.loadErrorTime = null;
              appOpts = val;
              var validationErrMessage, validationErrCode;

              if (_typeof(appOpts) !== "object") {
                validationErrCode = 34;

                {
                  validationErrMessage = "does not export anything";
                }
              }

              if ( // ES Modules don't have the Object prototype
              Object.prototype.hasOwnProperty.call(appOpts, "bootstrap") && !validLifecycleFn(appOpts.bootstrap)) {
                validationErrCode = 35;

                {
                  validationErrMessage = "does not export a valid bootstrap function or array of functions";
                }
              }

              if (!validLifecycleFn(appOpts.mount)) {
                validationErrCode = 36;

                {
                  validationErrMessage = "does not export a mount function or array of functions";
                }
              }

              if (!validLifecycleFn(appOpts.unmount)) {
                validationErrCode = 37;

                {
                  validationErrMessage = "does not export a unmount function or array of functions";
                }
              }

              var type = objectType(appOpts);

              if (validationErrCode) {
                var appOptsStr;

                try {
                  appOptsStr = JSON.stringify(appOpts);
                } catch (_unused) {}

                console.error(formatErrorMessage(validationErrCode, "The loading function for single-spa ".concat(type, " '").concat(toName(appOrParcel), "' resolved with the following, which does not have bootstrap, mount, and unmount functions"), type, toName(appOrParcel), appOptsStr), appOpts);
                handleAppError(validationErrMessage, appOrParcel, SKIP_BECAUSE_BROKEN);
                return appOrParcel;
              }

              if (appOpts.devtools && appOpts.devtools.overlays) {
                appOrParcel.devtools.overlays = assign({}, appOrParcel.devtools.overlays, appOpts.devtools.overlays);
              }

              appOrParcel.status = NOT_BOOTSTRAPPED;
              appOrParcel.bootstrap = flattenFnArray(appOpts, "bootstrap");
              appOrParcel.mount = flattenFnArray(appOpts, "mount");
              appOrParcel.unmount = flattenFnArray(appOpts, "unmount");
              appOrParcel.unload = flattenFnArray(appOpts, "unload");
              appOrParcel.timeouts = ensureValidAppTimeouts(appOpts.timeouts);
              delete appOrParcel.loadPromise;

              {
                addProfileEntry("application", toName(appOrParcel), "load", startTime, performance.now(), true);
              }

              return appOrParcel;
            });
          }).catch(function (err) {
            delete appOrParcel.loadPromise;
            var newStatus;

            if (isUserErr) {
              newStatus = SKIP_BECAUSE_BROKEN;
            } else {
              newStatus = LOAD_ERROR;
              appOrParcel.loadErrorTime = new Date().getTime();
            }

            handleAppError(err, appOrParcel, newStatus);

            {
              addProfileEntry("application", toName(appOrParcel), "load", startTime, performance.now(), false);
            }

            return appOrParcel;
          });
        });
      }

      var isInBrowser = typeof window !== "undefined";

      /* We capture navigation event listeners so that we can make sure
       * that application navigation listeners are not called until
       * single-spa has ensured that the correct applications are
       * unmounted and mounted.
       */

      var capturedEventListeners = {
        hashchange: [],
        popstate: []
      };
      var routingEventsListeningTo = ["hashchange", "popstate"];
      function navigateToUrl(obj) {
        var url;

        if (typeof obj === "string") {
          url = obj;
        } else if (this && this.href) {
          url = this.href;
        } else if (obj && obj.currentTarget && obj.currentTarget.href && obj.preventDefault) {
          url = obj.currentTarget.href;
          obj.preventDefault();
        } else {
          throw Error(formatErrorMessage(14, "singleSpaNavigate/navigateToUrl must be either called with a string url, with an <a> tag as its context, or with an event whose currentTarget is an <a> tag"));
        }

        var current = parseUri(window.location.href);
        var destination = parseUri(url);

        if (url.indexOf("#") === 0) {
          window.location.hash = destination.hash;
        } else if (current.host !== destination.host && destination.host) {
          {
            window.location.href = url;
          }
        } else if (destination.pathname === current.pathname && destination.search === current.search) {
          window.location.hash = destination.hash;
        } else {
          // different path, host, or query params
          window.history.pushState(null, null, url);
        }
      }
      function callCapturedEventListeners(eventArguments) {
        var _this = this;

        if (eventArguments) {
          var eventType = eventArguments[0].type;

          if (routingEventsListeningTo.indexOf(eventType) >= 0) {
            capturedEventListeners[eventType].forEach(function (listener) {
              try {
                // The error thrown by application event listener should not break single-spa down.
                // Just like https://github.com/single-spa/single-spa/blob/85f5042dff960e40936f3a5069d56fc9477fac04/src/navigation/reroute.js#L140-L146 did
                listener.apply(_this, eventArguments);
              } catch (e) {
                setTimeout(function () {
                  throw e;
                });
              }
            });
          }
        }
      }
      var urlRerouteOnly;

      function urlReroute() {
        reroute([], arguments);
      }

      function patchedUpdateState(updateState, methodName) {
        return function () {
          var urlBefore = window.location.href;
          var result = updateState.apply(this, arguments);
          var urlAfter = window.location.href;

          if (!urlRerouteOnly || urlBefore !== urlAfter) {
            // fire an artificial popstate event so that
            // single-spa applications know about routing that
            // occurs in a different application
            window.dispatchEvent(createPopStateEvent(window.history.state, methodName));
          }

          return result;
        };
      }

      function createPopStateEvent(state, originalMethodName) {
        // https://github.com/single-spa/single-spa/issues/224 and https://github.com/single-spa/single-spa-angular/issues/49
        // We need a popstate event even though the browser doesn't do one by default when you call replaceState, so that
        // all the applications can reroute. We explicitly identify this extraneous event by setting singleSpa=true and
        // singleSpaTrigger=<pushState|replaceState> on the event instance.
        var evt;

        try {
          evt = new PopStateEvent("popstate", {
            state: state
          });
        } catch (err) {
          // IE 11 compatibility https://github.com/single-spa/single-spa/issues/299
          // https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-html5e/bd560f47-b349-4d2c-baa8-f1560fb489dd
          evt = document.createEvent("PopStateEvent");
          evt.initPopStateEvent("popstate", false, false, state);
        }

        evt.singleSpa = true;
        evt.singleSpaTrigger = originalMethodName;
        return evt;
      }

      var originalReplaceState = null;
      var historyApiIsPatched = false; // We patch the history API so single-spa is notified of all calls to pushState/replaceState.
      // We patch addEventListener/removeEventListener so we can capture all popstate/hashchange event listeners,
      // and delay calling them until single-spa has finished mounting/unmounting applications

      function patchHistoryApi(opts) {
        if (historyApiIsPatched) {
          throw Error(formatErrorMessage(43, "single-spa: patchHistoryApi() was called after the history api was already patched."));
        } // True by default, as a performance optimization that reduces
        // the number of extraneous popstate events


        urlRerouteOnly = opts && opts.hasOwnProperty("urlRerouteOnly") ? opts.urlRerouteOnly : true;
        historyApiIsPatched = true;
        originalReplaceState = window.history.replaceState; // We will trigger an app change for any routing events.

        window.addEventListener("hashchange", urlReroute);
        window.addEventListener("popstate", urlReroute); // Monkeypatch addEventListener so that we can ensure correct timing

        var originalAddEventListener = window.addEventListener;
        var originalRemoveEventListener = window.removeEventListener;

        window.addEventListener = function (eventName, fn) {
          if (typeof fn === "function") {
            if (routingEventsListeningTo.indexOf(eventName) >= 0 && !find(capturedEventListeners[eventName], function (listener) {
              return listener === fn;
            })) {
              capturedEventListeners[eventName].push(fn);
              return;
            }
          }

          return originalAddEventListener.apply(this, arguments);
        };

        window.removeEventListener = function (eventName, listenerFn) {
          if (typeof listenerFn === "function") {
            if (routingEventsListeningTo.indexOf(eventName) >= 0) {
              capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(function (fn) {
                return fn !== listenerFn;
              });
              return;
            }
          }

          return originalRemoveEventListener.apply(this, arguments);
        };

        window.history.pushState = patchedUpdateState(window.history.pushState, "pushState");
        window.history.replaceState = patchedUpdateState(originalReplaceState, "replaceState");
      } // Detect if single-spa has already been loaded on the page.
      // If so, warn because this can result in lots of problems, including
      // lots of extraneous popstate events and unexpected results for
      // apis like getAppNames().

      if (isInBrowser) {
        if (window.singleSpaNavigate) {
          console.warn(formatErrorMessage(41, "single-spa has been loaded twice on the page. This can result in unexpected behavior."));
        } else {
          /* For convenience in `onclick` attributes, we expose a global function for navigating to
           * whatever an <a> tag's href is.
           */
          window.singleSpaNavigate = navigateToUrl;
        }
      }

      function parseUri(str) {
        var anchor = document.createElement("a");
        anchor.href = str;
        return anchor;
      }

      var hasInitialized = false;
      function ensureJQuerySupport() {
        var jQuery = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.jQuery;

        if (!jQuery) {
          if (window.$ && window.$.fn && window.$.fn.jquery) {
            jQuery = window.$;
          }
        }

        if (jQuery && !hasInitialized) {
          var originalJQueryOn = jQuery.fn.on;
          var originalJQueryOff = jQuery.fn.off;

          jQuery.fn.on = function (eventString, fn) {
            return captureRoutingEvents.call(this, originalJQueryOn, window.addEventListener, eventString, fn, arguments);
          };

          jQuery.fn.off = function (eventString, fn) {
            return captureRoutingEvents.call(this, originalJQueryOff, window.removeEventListener, eventString, fn, arguments);
          };

          hasInitialized = true;
        }
      }

      function captureRoutingEvents(originalJQueryFunction, nativeFunctionToCall, eventString, fn, originalArgs) {
        if (typeof eventString !== "string") {
          return originalJQueryFunction.apply(this, originalArgs);
        }

        var eventNames = eventString.split(/\s+/);
        eventNames.forEach(function (eventName) {
          if (routingEventsListeningTo.indexOf(eventName) >= 0) {
            nativeFunctionToCall(eventName, fn);
            eventString = eventString.replace(eventName, "");
          }
        });

        if (eventString.trim() === "") {
          return this;
        } else {
          return originalJQueryFunction.apply(this, originalArgs);
        }
      }

      var appsToUnload = {};
      function toUnloadPromise(appOrParcel) {
        return Promise.resolve().then(function () {
          var unloadInfo = appsToUnload[toName(appOrParcel)];

          if (!unloadInfo) {
            /* No one has called unloadApplication for this app,
             */
            return appOrParcel;
          }

          if (appOrParcel.status === NOT_LOADED) {
            /* This app is already unloaded. We just need to clean up
             * anything that still thinks we need to unload the app.
             */
            finishUnloadingApp(appOrParcel, unloadInfo);
            return appOrParcel;
          }

          if (appOrParcel.status === UNLOADING) {
            /* Both unloadApplication and reroute want to unload this app.
             * It only needs to be done once, though.
             */
            return unloadInfo.promise.then(function () {
              return appOrParcel;
            });
          }

          if (appOrParcel.status !== NOT_MOUNTED && appOrParcel.status !== LOAD_ERROR) {
            /* The app cannot be unloaded until it is unmounted.
             */
            return appOrParcel;
          }

          var startTime;

          {
            startTime = performance.now();
          }

          var unloadPromise = appOrParcel.status === LOAD_ERROR ? Promise.resolve() : reasonableTime(appOrParcel, "unload");
          appOrParcel.status = UNLOADING;
          return unloadPromise.then(function () {
            {
              addProfileEntry("application", toName(appOrParcel), "unload", startTime, performance.now(), true);
            }

            finishUnloadingApp(appOrParcel, unloadInfo);
            return appOrParcel;
          }).catch(function (err) {
            {
              addProfileEntry("application", toName(appOrParcel), "unload", startTime, performance.now(), false);
            }

            errorUnloadingApp(appOrParcel, unloadInfo, err);
            return appOrParcel;
          });
        });
      }

      function finishUnloadingApp(app, unloadInfo) {
        delete appsToUnload[toName(app)]; // Unloaded apps don't have lifecycles

        delete app.bootstrap;
        delete app.mount;
        delete app.unmount;
        delete app.unload;
        app.status = NOT_LOADED;
        /* resolve the promise of whoever called unloadApplication.
         * This should be done after all other cleanup/bookkeeping
         */

        unloadInfo.resolve();
      }

      function errorUnloadingApp(app, unloadInfo, err) {
        delete appsToUnload[toName(app)]; // Unloaded apps don't have lifecycles

        delete app.bootstrap;
        delete app.mount;
        delete app.unmount;
        delete app.unload;
        handleAppError(err, app, SKIP_BECAUSE_BROKEN);
        unloadInfo.reject(err);
      }

      function addAppToUnload(app, promiseGetter, resolve, reject) {
        appsToUnload[toName(app)] = {
          app: app,
          resolve: resolve,
          reject: reject
        };
        Object.defineProperty(appsToUnload[toName(app)], "promise", {
          get: promiseGetter
        });
      }
      function getAppUnloadInfo(appName) {
        return appsToUnload[appName];
      }

      var apps = [];
      function getAppChanges() {
        var appsToUnload = [],
            appsToUnmount = [],
            appsToLoad = [],
            appsToMount = []; // We re-attempt to download applications in LOAD_ERROR after a timeout of 200 milliseconds

        var currentTime = new Date().getTime();
        apps.forEach(function (app) {
          var appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);

          switch (app.status) {
            case LOAD_ERROR:
              if (appShouldBeActive && currentTime - app.loadErrorTime >= 200) {
                appsToLoad.push(app);
              }

              break;

            case NOT_LOADED:
            case LOADING_SOURCE_CODE:
              if (appShouldBeActive) {
                appsToLoad.push(app);
              }

              break;

            case NOT_BOOTSTRAPPED:
            case NOT_MOUNTED:
              if (!appShouldBeActive && getAppUnloadInfo(toName(app))) {
                appsToUnload.push(app);
              } else if (appShouldBeActive) {
                appsToMount.push(app);
              }

              break;

            case MOUNTED:
              if (!appShouldBeActive) {
                appsToUnmount.push(app);
              }

              break;
            // all other statuses are ignored
          }
        });
        return {
          appsToUnload: appsToUnload,
          appsToUnmount: appsToUnmount,
          appsToLoad: appsToLoad,
          appsToMount: appsToMount
        };
      }
      function getMountedApps() {
        return apps.filter(isActive).map(toName);
      }
      function getAppNames() {
        return apps.map(toName);
      } // used in devtools, not (currently) exposed as a single-spa API

      function getRawAppData() {
        return [].concat(apps);
      }
      function getAppStatus(appName) {
        var app = find(apps, function (app) {
          return toName(app) === appName;
        });
        return app ? app.status : null;
      }
      var startWarningInitialized = false;
      function registerApplication(appNameOrConfig, appOrLoadApp, activeWhen, customProps) {
        var registration = sanitizeArguments(appNameOrConfig, appOrLoadApp, activeWhen, customProps);

        if (!isStarted() && !startWarningInitialized) {
          startWarningInitialized = true;
          setTimeout(function () {
            if (!isStarted()) {
              console.warn(formatErrorMessage(1, "singleSpa.start() has not been called, 5000ms after single-spa was loaded. Before start() is called, apps can be declared and loaded, but not bootstrapped or mounted."));
            }
          }, 5000);
        }

        if (getAppNames().indexOf(registration.name) !== -1) throw Error(formatErrorMessage(21, "There is already an app registered with name ".concat(registration.name), registration.name));
        apps.push(assign({
          loadErrorTime: null,
          status: NOT_LOADED,
          parcels: {},
          devtools: {
            overlays: {
              options: {},
              selectors: []
            }
          }
        }, registration));

        if (isInBrowser) {
          ensureJQuerySupport();
          reroute();
        }
      }
      function checkActivityFunctions() {
        var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location;
        return apps.filter(function (app) {
          return app.activeWhen(location);
        }).map(toName);
      }
      function unregisterApplication(appName) {
        if (apps.filter(function (app) {
          return toName(app) === appName;
        }).length === 0) {
          throw Error(formatErrorMessage(25, "Cannot unregister application '".concat(appName, "' because no such application has been registered"), appName));
        } // See https://github.com/single-spa/single-spa/issues/871 for why waitForUnmount is false


        return unloadApplication(appName, {
          waitForUnmount: false
        }).then(function () {
          var appIndex = apps.map(toName).indexOf(appName);
          apps.splice(appIndex, 1);
        });
      }
      function unloadApplication(appName) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          waitForUnmount: false
        };

        if (typeof appName !== "string") {
          throw Error(formatErrorMessage(26, "unloadApplication requires a string 'appName'"));
        }

        var app = find(apps, function (App) {
          return toName(App) === appName;
        });

        if (!app) {
          throw Error(formatErrorMessage(27, "Could not unload application '".concat(appName, "' because no such application has been registered"), appName));
        }

        var appUnloadInfo = getAppUnloadInfo(toName(app));

        if (opts && opts.waitForUnmount) {
          // We need to wait for unmount before unloading the app
          if (appUnloadInfo) {
            // Someone else is already waiting for this, too
            return appUnloadInfo.promise;
          } else {
            // We're the first ones wanting the app to be resolved.
            var promise = new Promise(function (resolve, reject) {
              addAppToUnload(app, function () {
                return promise;
              }, resolve, reject);
            });
            return promise;
          }
        } else {
          /* We should unmount the app, unload it, and remount it immediately.
           */
          var resultPromise;

          if (appUnloadInfo) {
            // Someone else is already waiting for this app to unload
            resultPromise = appUnloadInfo.promise;
            immediatelyUnloadApp(app, appUnloadInfo.resolve, appUnloadInfo.reject);
          } else {
            // We're the first ones wanting the app to be resolved.
            resultPromise = new Promise(function (resolve, reject) {
              addAppToUnload(app, function () {
                return resultPromise;
              }, resolve, reject);
              immediatelyUnloadApp(app, resolve, reject);
            });
          }

          return resultPromise;
        }
      }

      function immediatelyUnloadApp(app, resolve, reject) {
        Promise.resolve().then(function () {
          // Before unmounting the application, we first must wait for it to finish mounting
          // Otherwise, the test for issue 871 in unregister-application.spec.js fails because
          // the application isn't really unmounted.
          if (find(checkActivityFunctions(), function (activeApp) {
            return activeApp === toName(app);
          })) {
            return triggerAppChange();
          }
        }).then(function () {
          return toUnmountPromise(app).then(toUnloadPromise).then(function () {
            resolve();
            setTimeout(function () {
              // reroute, but the unload promise is done
              reroute();
            });
          });
        }).catch(reject);
      }

      function validateRegisterWithArguments(name, appOrLoadApp, activeWhen, customProps) {
        if (typeof name !== "string" || name.length === 0) throw Error(formatErrorMessage(20, "The 1st argument to registerApplication must be a non-empty string 'appName'"));
        if (!appOrLoadApp) throw Error(formatErrorMessage(23, "The 2nd argument to registerApplication must be an application or loading application function"));
        if (typeof activeWhen !== "function") throw Error(formatErrorMessage(24, "The 3rd argument to registerApplication must be an activeWhen function"));
        if (!validCustomProps(customProps)) throw Error(formatErrorMessage(22, "The optional 4th argument is a customProps and must be an object"));
      }

      function validateRegisterWithConfig(config) {
        if (Array.isArray(config) || config === null) throw Error(formatErrorMessage(39, "Configuration object can't be an Array or null!"));
        var validKeys = ["name", "app", "activeWhen", "customProps"];
        var invalidKeys = Object.keys(config).reduce(function (invalidKeys, prop) {
          return validKeys.indexOf(prop) >= 0 ? invalidKeys : invalidKeys.concat(prop);
        }, []);
        if (invalidKeys.length !== 0) throw Error(formatErrorMessage(38, "The configuration object accepts only: ".concat(validKeys.join(", "), ". Invalid keys: ").concat(invalidKeys.join(", "), "."), validKeys.join(", "), invalidKeys.join(", ")));
        if (typeof config.name !== "string" || config.name.length === 0) throw Error(formatErrorMessage(20, "The config.name on registerApplication must be a non-empty string"));
        if (_typeof(config.app) !== "object" && typeof config.app !== "function") throw Error(formatErrorMessage(20, "The config.app on registerApplication must be an application or a loading function"));

        var allowsStringAndFunction = function allowsStringAndFunction(activeWhen) {
          return typeof activeWhen === "string" || typeof activeWhen === "function";
        };

        if (!allowsStringAndFunction(config.activeWhen) && !(Array.isArray(config.activeWhen) && config.activeWhen.every(allowsStringAndFunction))) throw Error(formatErrorMessage(24, "The config.activeWhen on registerApplication must be a string, function or an array with both"));
        if (!validCustomProps(config.customProps)) throw Error(formatErrorMessage(22, "The optional config.customProps must be an object"));
      }

      function validCustomProps(customProps) {
        return !customProps || typeof customProps === "function" || _typeof(customProps) === "object" && customProps !== null && !Array.isArray(customProps);
      }

      function sanitizeArguments(appNameOrConfig, appOrLoadApp, activeWhen, customProps) {
        var usingObjectAPI = _typeof(appNameOrConfig) === "object";
        var registration = {
          name: null,
          loadApp: null,
          activeWhen: null,
          customProps: null
        };

        if (usingObjectAPI) {
          validateRegisterWithConfig(appNameOrConfig);
          registration.name = appNameOrConfig.name;
          registration.loadApp = appNameOrConfig.app;
          registration.activeWhen = appNameOrConfig.activeWhen;
          registration.customProps = appNameOrConfig.customProps;
        } else {
          validateRegisterWithArguments(appNameOrConfig, appOrLoadApp, activeWhen, customProps);
          registration.name = appNameOrConfig;
          registration.loadApp = appOrLoadApp;
          registration.activeWhen = activeWhen;
          registration.customProps = customProps;
        }

        registration.loadApp = sanitizeLoadApp(registration.loadApp);
        registration.customProps = sanitizeCustomProps(registration.customProps);
        registration.activeWhen = sanitizeActiveWhen(registration.activeWhen);
        return registration;
      }

      function sanitizeLoadApp(loadApp) {
        if (typeof loadApp !== "function") {
          return function () {
            return Promise.resolve(loadApp);
          };
        }

        return loadApp;
      }

      function sanitizeCustomProps(customProps) {
        return customProps ? customProps : {};
      }

      function sanitizeActiveWhen(activeWhen) {
        var activeWhenArray = Array.isArray(activeWhen) ? activeWhen : [activeWhen];
        activeWhenArray = activeWhenArray.map(function (activeWhenOrPath) {
          return typeof activeWhenOrPath === "function" ? activeWhenOrPath : pathToActiveWhen(activeWhenOrPath);
        });
        return function (location) {
          return activeWhenArray.some(function (activeWhen) {
            return activeWhen(location);
          });
        };
      }

      function pathToActiveWhen(path, exactMatch) {
        var regex = toDynamicPathValidatorRegex(path, exactMatch);
        return function (location) {
          // compatible with IE10
          var origin = location.origin;

          if (!origin) {
            origin = "".concat(location.protocol, "//").concat(location.host);
          }

          var route = location.href.replace(origin, "").replace(location.search, "").split("?")[0];
          return regex.test(route);
        };
      }

      function toDynamicPathValidatorRegex(path, exactMatch) {
        var lastIndex = 0,
            inDynamic = false,
            regexStr = "^";

        if (path[0] !== "/") {
          path = "/" + path;
        }

        for (var charIndex = 0; charIndex < path.length; charIndex++) {
          var char = path[charIndex];
          var startOfDynamic = !inDynamic && char === ":";
          var endOfDynamic = inDynamic && char === "/";

          if (startOfDynamic || endOfDynamic) {
            appendToRegex(charIndex);
          }
        }

        appendToRegex(path.length);
        return new RegExp(regexStr, "i");

        function appendToRegex(index) {
          var anyCharMaybeTrailingSlashRegex = "[^/]+/?";
          var commonStringSubPath = escapeStrRegex(path.slice(lastIndex, index));
          regexStr += inDynamic ? anyCharMaybeTrailingSlashRegex : commonStringSubPath;

          if (index === path.length) {
            if (inDynamic) {
              if (exactMatch) {
                // Ensure exact match paths that end in a dynamic portion don't match
                // urls with characters after a slash after the dynamic portion.
                regexStr += "$";
              }
            } else {
              // For exact matches, expect no more characters. Otherwise, allow
              // any characters.
              var suffix = exactMatch ? "" : ".*";
              regexStr = // use charAt instead as we could not use es6 method endsWith
              regexStr.charAt(regexStr.length - 1) === "/" ? "".concat(regexStr).concat(suffix, "$") : "".concat(regexStr, "(/").concat(suffix, ")?(#.*)?$");
            }
          }

          inDynamic = !inDynamic;
          lastIndex = index;
        }

        function escapeStrRegex(str) {
          // borrowed from https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
          return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
        }
      }

      var appChangeUnderway = false,
          peopleWaitingOnAppChange = [],
          currentUrl = isInBrowser && window.location.href;
      function triggerAppChange() {
        // Call reroute with no arguments, intentionally
        return reroute();
      }
      function reroute() {
        var pendingPromises = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var eventArguments = arguments.length > 1 ? arguments[1] : undefined;
        var silentNavigation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (appChangeUnderway) {
          return new Promise(function (resolve, reject) {
            peopleWaitingOnAppChange.push({
              resolve: resolve,
              reject: reject,
              eventArguments: eventArguments
            });
          });
        }

        var startTime, profilerKind;

        {
          startTime = performance.now();

          if (silentNavigation) {
            profilerKind = "silentNavigation";
          } else if (eventArguments) {
            profilerKind = "browserNavigation";
          } else {
            profilerKind = "triggerAppChange";
          }
        }

        var _getAppChanges = getAppChanges(),
            appsToUnload = _getAppChanges.appsToUnload,
            appsToUnmount = _getAppChanges.appsToUnmount,
            appsToLoad = _getAppChanges.appsToLoad,
            appsToMount = _getAppChanges.appsToMount;

        var appsThatChanged,
            cancelPromises = [],
            oldUrl = currentUrl,
            newUrl = currentUrl = window.location.href;

        if (isStarted()) {
          appChangeUnderway = true;
          appsThatChanged = appsToUnload.concat(appsToLoad, appsToUnmount, appsToMount);
          return performAppChanges();
        } else {
          appsThatChanged = appsToLoad;
          return loadApps();
        }

        function cancelNavigation() {
          var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          var promise = typeof (val === null || val === void 0 ? void 0 : val.then) === "function" ? val : Promise.resolve(val);
          cancelPromises.push(promise.catch(function (err) {
            console.warn(Error(formatErrorMessage(42, "single-spa: A cancelNavigation promise rejected with the following value: ".concat(err))));
            console.warn(err); // Interpret a Promise rejection to mean that the navigation should not be canceled

            return false;
          }));
        }

        function loadApps() {
          return Promise.resolve().then(function () {
            var loadPromises = appsToLoad.map(toLoadPromise);
            var succeeded;
            return Promise.all(loadPromises).then(callAllEventListeners) // there are no mounted apps, before start() is called, so we always return []
            .then(function () {
              {
                succeeded = true;
              }

              return [];
            }).catch(function (err) {
              {
                succeeded = false;
              }

              callAllEventListeners();
              throw err;
            }).finally(function () {
              {
                addProfileEntry("routing", "loadApps", profilerKind, startTime, performance.now(), succeeded);
              }
            });
          });
        }

        function performAppChanges() {
          return Promise.resolve().then(function () {
            // https://github.com/single-spa/single-spa/issues/545
            fireSingleSpaEvent(appsThatChanged.length === 0 ? "before-no-app-change" : "before-app-change", getCustomEventDetail(true));
            fireSingleSpaEvent("before-routing-event", getCustomEventDetail(true, {
              cancelNavigation: cancelNavigation
            }));
            return Promise.all(cancelPromises).then(function (cancelValues) {
              var navigationIsCanceled = cancelValues.some(function (v) {
                return v;
              });

              if (navigationIsCanceled) {
                // Change url back to old url, without triggering the normal single-spa reroute
                originalReplaceState.call(window.history, history.state, "", oldUrl.substring(location.origin.length)); // Single-spa's internal tracking of current url needs to be updated after the url change above

                currentUrl = location.href; // necessary for the reroute function to know that the current reroute is finished

                appChangeUnderway = false;

                {
                  addProfileEntry("routing", "navigationCanceled", profilerKind, startTime, performance.now(), true);
                } // Tell single-spa to reroute again, this time with the url set to the old URL


                return reroute(pendingPromises, eventArguments, true);
              }

              var unloadPromises = appsToUnload.map(toUnloadPromise);
              var unmountUnloadPromises = appsToUnmount.map(toUnmountPromise).map(function (unmountPromise) {
                return unmountPromise.then(toUnloadPromise);
              });
              var allUnmountPromises = unmountUnloadPromises.concat(unloadPromises);
              var unmountAllPromise = Promise.all(allUnmountPromises);
              var unmountFinishedTime;
              unmountAllPromise.then(function () {
                {
                  unmountFinishedTime = performance.now();
                  addProfileEntry("routing", "unmountAndUnload", profilerKind, startTime, performance.now(), true);
                }

                fireSingleSpaEvent("before-mount-routing-event", getCustomEventDetail(true));
              }, function (err) {
                {
                  addProfileEntry("routing", "unmountAndUnload", profilerKind, startTime, performance.now(), true);
                }

                throw err;
              });
              /* We load and bootstrap apps while other apps are unmounting, but we
               * wait to mount the app until all apps are finishing unmounting
               */

              var loadThenMountPromises = appsToLoad.map(function (app) {
                return toLoadPromise(app).then(function (app) {
                  return tryToBootstrapAndMount(app, unmountAllPromise);
                });
              });
              /* These are the apps that are already bootstrapped and just need
               * to be mounted. They each wait for all unmounting apps to finish up
               * before they mount.
               */

              var mountPromises = appsToMount.filter(function (appToMount) {
                return appsToLoad.indexOf(appToMount) < 0;
              }).map(function (appToMount) {
                return tryToBootstrapAndMount(appToMount, unmountAllPromise);
              });
              return unmountAllPromise.catch(function (err) {
                callAllEventListeners();
                throw err;
              }).then(function () {
                /* Now that the apps that needed to be unmounted are unmounted, their DOM navigation
                 * events (like hashchange or popstate) should have been cleaned up. So it's safe
                 * to let the remaining captured event listeners to handle about the DOM event.
                 */
                callAllEventListeners();
                return Promise.all(loadThenMountPromises.concat(mountPromises)).catch(function (err) {
                  pendingPromises.forEach(function (promise) {
                    return promise.reject(err);
                  });
                  throw err;
                }).then(finishUpAndReturn).then(function () {
                  {
                    addProfileEntry("routing", "loadAndMount", profilerKind, unmountFinishedTime, performance.now(), true);
                  }
                }, function (err) {
                  {
                    addProfileEntry("routing", "loadAndMount", profilerKind, unmountFinishedTime, performance.now(), false);
                  }

                  throw err;
                });
              });
            });
          });
        }

        function finishUpAndReturn() {
          var returnValue = getMountedApps();
          pendingPromises.forEach(function (promise) {
            return promise.resolve(returnValue);
          });

          try {
            var appChangeEventName = appsThatChanged.length === 0 ? "no-app-change" : "app-change";
            fireSingleSpaEvent(appChangeEventName, getCustomEventDetail());
            fireSingleSpaEvent("routing-event", getCustomEventDetail());
          } catch (err) {
            /* We use a setTimeout because if someone else's event handler throws an error, single-spa
             * needs to carry on. If a listener to the event throws an error, it's their own fault, not
             * single-spa's.
             */
            setTimeout(function () {
              throw err;
            });
          }
          /* Setting this allows for subsequent calls to reroute() to actually perform
           * a reroute instead of just getting queued behind the current reroute call.
           * We want to do this after the mounting/unmounting is done but before we
           * resolve the promise for the `reroute` function.
           */


          appChangeUnderway = false;

          if (peopleWaitingOnAppChange.length > 0) {
            /* While we were rerouting, someone else triggered another reroute that got queued.
             * So we need reroute again.
             */
            var nextPendingPromises = peopleWaitingOnAppChange;
            peopleWaitingOnAppChange = [];
            reroute(nextPendingPromises);
          }

          return returnValue;
        }
        /* We need to call all event listeners that have been delayed because they were
         * waiting on single-spa. This includes haschange and popstate events for both
         * the current run of performAppChanges(), but also all of the queued event listeners.
         * We want to call the listeners in the same order as if they had not been delayed by
         * single-spa, which means queued ones first and then the most recent one.
         */


        function callAllEventListeners() {
          // During silent navigation (when navigation was canceled and we're going back to the old URL),
          // we should not fire any popstate / hashchange events
          if (!silentNavigation) {
            pendingPromises.forEach(function (pendingPromise) {
              callCapturedEventListeners(pendingPromise.eventArguments);
            });
            callCapturedEventListeners(eventArguments);
          }
        }

        function getCustomEventDetail() {
          var _appsByNewStatus;

          var isBeforeChanges = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var extraProperties = arguments.length > 1 ? arguments[1] : undefined;
          var newAppStatuses = {};
          var appsByNewStatus = (_appsByNewStatus = {}, _defineProperty(_appsByNewStatus, MOUNTED, []), _defineProperty(_appsByNewStatus, NOT_MOUNTED, []), _defineProperty(_appsByNewStatus, NOT_LOADED, []), _defineProperty(_appsByNewStatus, SKIP_BECAUSE_BROKEN, []), _appsByNewStatus);

          if (isBeforeChanges) {
            appsToLoad.concat(appsToMount).forEach(function (app, index) {
              addApp(app, MOUNTED);
            });
            appsToUnload.forEach(function (app) {
              addApp(app, NOT_LOADED);
            });
            appsToUnmount.forEach(function (app) {
              addApp(app, NOT_MOUNTED);
            });
          } else {
            appsThatChanged.forEach(function (app) {
              addApp(app);
            });
          }

          var result = {
            detail: {
              newAppStatuses: newAppStatuses,
              appsByNewStatus: appsByNewStatus,
              totalAppChanges: appsThatChanged.length,
              originalEvent: eventArguments === null || eventArguments === void 0 ? void 0 : eventArguments[0],
              oldUrl: oldUrl,
              newUrl: newUrl
            }
          };

          if (extraProperties) {
            assign(result.detail, extraProperties);
          }

          return result;

          function addApp(app, status) {
            var appName = toName(app);
            status = status || getAppStatus(appName);
            newAppStatuses[appName] = status;
            var statusArr = appsByNewStatus[status] = appsByNewStatus[status] || [];
            statusArr.push(appName);
          }
        }

        function fireSingleSpaEvent(name, eventProperties) {
          // During silent navigation (caused by navigation cancelation), we should not
          // fire any single-spa events
          if (!silentNavigation) {
            window.dispatchEvent(new customEvent("single-spa:".concat(name), eventProperties));
          }
        }
      }
      /**
       * Let's imagine that some kind of delay occurred during application loading.
       * The user without waiting for the application to load switched to another route,
       * this means that we shouldn't bootstrap and mount that application, thus we check
       * twice if that application should be active before bootstrapping and mounting.
       * https://github.com/single-spa/single-spa/issues/524
       */

      function tryToBootstrapAndMount(app, unmountAllPromise) {
        if (shouldBeActive(app)) {
          return toBootstrapPromise(app).then(function (app) {
            return unmountAllPromise.then(function () {
              return shouldBeActive(app) ? toMountPromise(app) : app;
            });
          });
        } else {
          return unmountAllPromise.then(function () {
            return app;
          });
        }
      }

      var started = false;
      function start(opts) {
        started = true;

        if (isInBrowser) {
          patchHistoryApi(opts);
          reroute();
        }
      }
      function isStarted() {
        return started;
      }

      var devtools = {
        getRawAppData: getRawAppData,
        reroute: reroute,
        NOT_LOADED: NOT_LOADED,
        toLoadPromise: toLoadPromise,
        toBootstrapPromise: toBootstrapPromise,
        unregisterApplication: unregisterApplication,
        getProfilerData: getProfilerData
      };

      if (isInBrowser && window.__SINGLE_SPA_DEVTOOLS__) {
        window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = devtools;
      }

    }
  };
});
//# sourceMappingURL=single-spa.dev.js.map
