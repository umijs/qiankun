/* single-spa@6.0.0-beta.3 - ES2015 - dev */
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

let errorHandlers = [];
function handleAppError(err, app, newStatus) {
  const transformedErr = transformErr(err, app, newStatus);

  if (errorHandlers.length) {
    errorHandlers.forEach(handler => handler(transformedErr));
  } else {
    setTimeout(() => {
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

  let removedSomething = false;
  errorHandlers = errorHandlers.filter(h => {
    const isHandler = h === handler;
    removedSomething = removedSomething || isHandler;
    return !isHandler;
  });
  return removedSomething;
}
function formatErrorMessage(code, msg, ...args) {
  return `single-spa minified message #${code}: ${msg ? msg + " " : ""}See https://single-spa.js.org/error/?code=${code}${args.length ? `&arg=${args.join("&arg=")}` : ""}`;
}
function transformErr(ogErr, appOrParcel, newStatus) {
  const errPrefix = `${objectType(appOrParcel)} '${toName(appOrParcel)}' died in status ${appOrParcel.status}: `;
  let result;

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
    console.warn(formatErrorMessage(30, `While ${appOrParcel.status}, '${toName(appOrParcel)}' rejected its lifecycle function promise with a non-Error. This will cause stack traces to not be accurate.`, appOrParcel.status, toName(appOrParcel)));

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

const NOT_LOADED = "NOT_LOADED";
const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE";
const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED";
const BOOTSTRAPPING = "BOOTSTRAPPING";
const NOT_MOUNTED = "NOT_MOUNTED";
const MOUNTING = "MOUNTING";
const MOUNTED = "MOUNTED";
const UPDATING = "UPDATING";
const UNMOUNTING = "UNMOUNTING";
const UNLOADING = "UNLOADING";
const LOAD_ERROR = "LOAD_ERROR";
const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";
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
  for (let i = arguments.length - 1; i > 0; i--) {
    for (let key in arguments[i]) {
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
  for (let i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      return arr[i];
    }
  }

  return null;
}

function validLifecycleFn(fn) {
  return fn && (typeof fn === "function" || isArrayOfFns(fn));

  function isArrayOfFns(arr) {
    return Array.isArray(arr) && !find(arr, item => typeof item !== "function");
  }
}
function flattenFnArray(appOrParcel, lifecycle) {
  let fns = appOrParcel[lifecycle] || [];
  fns = Array.isArray(fns) ? fns : [fns];

  if (fns.length === 0) {
    fns = [() => Promise.resolve()];
  }

  const type = objectType(appOrParcel);
  const name = toName(appOrParcel);
  return function (props) {
    return fns.reduce((resultPromise, fn, index) => {
      return resultPromise.then(() => {
        const thisPromise = fn(props);
        return smellsLikeAPromise(thisPromise) ? thisPromise : Promise.reject(formatErrorMessage(15, `Within ${type} ${name}, the lifecycle function ${lifecycle} at array index ${index} did not return a promise`, type, name, lifecycle, index));
      });
    }, Promise.resolve());
  };
}
function smellsLikeAPromise(promise) {
  return promise && typeof promise.then === "function" && typeof promise.catch === "function";
}

let profileEntries = [];
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
    type,
    name,
    start,
    end,
    kind,
    operationSucceeded
  });
}

function toBootstrapPromise(appOrParcel, hardFail) {
  let startTime, profileEventType;
  return Promise.resolve().then(() => {
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

    return reasonableTime(appOrParcel, "bootstrap").then(successfulBootstrap).catch(err => {
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
  return Promise.resolve().then(() => {
    if (appOrParcel.status !== MOUNTED) {
      return appOrParcel;
    }

    let startTime, profileEventType;

    {
      startTime = performance.now();
      profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
    }

    appOrParcel.status = UNMOUNTING;
    const unmountChildrenParcels = Object.keys(appOrParcel.parcels).map(parcelId => appOrParcel.parcels[parcelId].unmountThisParcel());
    return Promise.all(unmountChildrenParcels).then(unmountAppOrParcel, parcelError => {
      // There is a parcel unmount error
      return unmountAppOrParcel().then(() => {
        // Unmounting the app/parcel succeeded, but unmounting its children parcels did not
        const parentError = Error(parcelError.message);

        if (hardFail) {
          throw transformErr(parentError, appOrParcel, SKIP_BECAUSE_BROKEN);
        } else {
          handleAppError(parentError, appOrParcel, SKIP_BECAUSE_BROKEN);
        }
      });
    }).then(() => appOrParcel);

    function unmountAppOrParcel() {
      // We always try to unmount the appOrParcel, even if the children parcels failed to unmount.
      return reasonableTime(appOrParcel, "unmount").then(() => {
        // The appOrParcel needs to stay in a broken status if its children parcels fail to unmount
        {
          appOrParcel.status = NOT_MOUNTED;
        }

        {
          addProfileEntry(profileEventType, toName(appOrParcel), "unmount", startTime, performance.now(), true);
        }
      }, err => {
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

let beforeFirstMountFired = false;
let firstMountFired = false;
function toMountPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(() => {
    if (appOrParcel.status !== NOT_MOUNTED) {
      return appOrParcel;
    }

    let startTime, profileEventType;

    {
      profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
      startTime = performance.now();
    }

    if (!beforeFirstMountFired) {
      window.dispatchEvent(new customEvent("single-spa:before-first-mount"));
      beforeFirstMountFired = true;
    }

    appOrParcel.status = MOUNTING;
    return reasonableTime(appOrParcel, "mount").then(() => {
      appOrParcel.status = MOUNTED;

      if (!firstMountFired) {
        window.dispatchEvent(new customEvent("single-spa:first-mount"));
        firstMountFired = true;
      }

      {
        addProfileEntry(profileEventType, toName(appOrParcel), "mount", startTime, performance.now(), true);
      }

      return appOrParcel;
    }).catch(err => {
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
  return Promise.resolve().then(() => {
    let startTime, profileEventType;

    {
      profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
      startTime = performance.now();
    }

    if (appOrParcel.status !== MOUNTED) {
      throw Error(formatErrorMessage(32, `Cannot update parcel '${toName(appOrParcel)}' because it is not mounted`, toName(appOrParcel)));
    }

    appOrParcel.status = UPDATING;
    return reasonableTime(appOrParcel, "update").then(() => {
      appOrParcel.status = MOUNTED;

      {
        addProfileEntry(profileEventType, toName(appOrParcel), "update", startTime, performance.now(), true);
      }

      return appOrParcel;
    }).catch(err => {
      {
        addProfileEntry(profileEventType, toName(appOrParcel), "update", startTime, performance.now(), false);
      }

      throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
    });
  });
}

let parcelCount = 0;
const rootParcels = {
  parcels: {}
}; // This is a public api, exported to users of single-spa

function mountRootParcel() {
  return mountParcel.apply(rootParcels, arguments);
}
function mountParcel(config, customProps) {
  const owningAppOrParcel = this; // Validate inputs

  if (!config || typeof config !== "object" && typeof config !== "function") {
    throw Error(formatErrorMessage(2, "Cannot mount parcel without a config object or config loading function"));
  }

  if (config.name && typeof config.name !== "string") {
    throw Error(formatErrorMessage(3, `Parcel name must be a string, if provided. Was given ${typeof config.name}`, typeof config.name));
  }

  const id = parcelCount++;
  let name = config.name || `parcel-${id}`;

  if (typeof customProps !== "object") {
    throw Error(formatErrorMessage(4, `Parcel ${name} has invalid customProps -- must be an object but was given ${typeof customProps}`, name, typeof customProps));
  }

  if (!customProps.domElement) {
    throw Error(formatErrorMessage(5, `Parcel ${name} cannot be mounted without a domElement provided as a prop`, name));
  }

  const passedConfigLoadingFunction = typeof config === "function";
  const configLoadingFunction = passedConfigLoadingFunction ? config : () => Promise.resolve(config); // Internal representation

  const parcel = {
    id,
    parcels: {},
    status: passedConfigLoadingFunction ? LOADING_SOURCE_CODE : NOT_BOOTSTRAPPED,
    customProps,
    parentName: toName(owningAppOrParcel),

    unmountThisParcel() {
      return mountPromise.then(() => {
        if (parcel.status !== MOUNTED) {
          throw Error(formatErrorMessage(6, `Cannot unmount parcel '${name}' -- it is in a ${parcel.status} status`, name, parcel.status));
        }

        return toUnmountPromise(parcel, true);
      }).then(value => {
        if (parcel.parentName) {
          delete owningAppOrParcel.parcels[parcel.id];
        }

        return value;
      }).then(value => {
        resolveUnmount(value);
        return value;
      }).catch(err => {
        parcel.status = SKIP_BECAUSE_BROKEN;
        rejectUnmount(err);
        throw err;
      });
    }

  }; // We return an external representation

  let externalRepresentation; // Add to owning app or parcel

  owningAppOrParcel.parcels[id] = parcel;
  let loadPromise = configLoadingFunction();

  if (!loadPromise || typeof loadPromise.then !== "function") {
    throw Error(formatErrorMessage(7, `When mounting a parcel, the config loading function must return a promise that resolves with the parcel config`));
  }

  loadPromise = loadPromise.then(config => {
    if (!config) {
      throw Error(formatErrorMessage(8, `When mounting a parcel, the config loading function returned a promise that did not resolve with a parcel config`));
    }

    name = config.name || `parcel-${id}`;

    if ( // ES Module objects don't have the object prototype
    Object.prototype.hasOwnProperty.call(config, "bootstrap") && !validLifecycleFn(config.bootstrap)) {
      throw Error(formatErrorMessage(9, `Parcel ${name} provided an invalid bootstrap function`, name));
    }

    if (!validLifecycleFn(config.mount)) {
      throw Error(formatErrorMessage(10, `Parcel ${name} must have a valid mount function`, name));
    }

    if (!validLifecycleFn(config.unmount)) {
      throw Error(formatErrorMessage(11, `Parcel ${name} must have a valid unmount function`, name));
    }

    if (config.update && !validLifecycleFn(config.update)) {
      throw Error(formatErrorMessage(12, `Parcel ${name} provided an invalid update function`, name));
    }

    const bootstrap = flattenFnArray(config, "bootstrap");
    const mount = flattenFnArray(config, "mount");
    const unmount = flattenFnArray(config, "unmount");
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

  const bootstrapPromise = loadPromise.then(() => toBootstrapPromise(parcel, true));
  const mountPromise = bootstrapPromise.then(() => toMountPromise(parcel, true));
  let resolveUnmount, rejectUnmount;
  const unmountPromise = new Promise((resolve, reject) => {
    resolveUnmount = resolve;
    rejectUnmount = reject;
  });
  externalRepresentation = {
    mount() {
      return promiseWithoutReturnValue(Promise.resolve().then(() => {
        if (parcel.status !== NOT_MOUNTED) {
          throw Error(formatErrorMessage(13, `Cannot mount parcel '${name}' -- it is in a ${parcel.status} status`, name, parcel.status));
        } // Add to owning app or parcel


        owningAppOrParcel.parcels[id] = parcel;
        return toMountPromise(parcel);
      }));
    },

    unmount() {
      return promiseWithoutReturnValue(parcel.unmountThisParcel());
    },

    getStatus() {
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
  return promise.then(() => null);
}

function getProps(appOrParcel) {
  const name = toName(appOrParcel);
  let customProps = typeof appOrParcel.customProps === "function" ? appOrParcel.customProps(name, window.location) : appOrParcel.customProps;

  if (typeof customProps !== "object" || customProps === null || Array.isArray(customProps)) {
    customProps = {};
    console.warn(formatErrorMessage(40, `single-spa: ${name}'s customProps function must return an object. Received ${customProps}`), name, customProps);
  }

  const result = assign({}, customProps, {
    name,
    mountParcel: mountParcel.bind(appOrParcel),
    singleSpa
  });

  if (isParcel(appOrParcel)) {
    result.unmountSelf = appOrParcel.unmountThisParcel;
  }

  return result;
}

const defaultWarningMillis = 1000;
const globalTimeoutConfig = {
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
    throw Error(formatErrorMessage(16, `bootstrap max time must be a positive integer number of milliseconds`));
  }

  globalTimeoutConfig.bootstrap = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setMountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(formatErrorMessage(17, `mount max time must be a positive integer number of milliseconds`));
  }

  globalTimeoutConfig.mount = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setUnmountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(formatErrorMessage(18, `unmount max time must be a positive integer number of milliseconds`));
  }

  globalTimeoutConfig.unmount = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setUnloadMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(formatErrorMessage(19, `unload max time must be a positive integer number of milliseconds`));
  }

  globalTimeoutConfig.unload = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function reasonableTime(appOrParcel, lifecycle) {
  const timeoutConfig = appOrParcel.timeouts[lifecycle];
  const warningPeriod = timeoutConfig.warningMillis;
  const type = objectType(appOrParcel);
  return new Promise((resolve, reject) => {
    let finished = false;
    let errored = false;
    appOrParcel[lifecycle](getProps(appOrParcel)).then(val => {
      finished = true;
      resolve(val);
    }).catch(val => {
      finished = true;
      reject(val);
    });
    setTimeout(() => maybeTimingOut(1), warningPeriod);
    setTimeout(() => maybeTimingOut(true), timeoutConfig.millis);
    const errMsg = formatErrorMessage(31, `Lifecycle function ${lifecycle} for ${type} ${toName(appOrParcel)} lifecycle did not resolve or reject for ${timeoutConfig.millis} ms.`, lifecycle, type, toName(appOrParcel), timeoutConfig.millis);

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
          const numWarnings = shouldError;
          const numMillis = numWarnings * warningPeriod;
          console.warn(errMsg);

          if (numMillis + warningPeriod < timeoutConfig.millis) {
            setTimeout(() => maybeTimingOut(numWarnings + 1), warningPeriod);
          }
        }
      }
    }
  });
}
function ensureValidAppTimeouts(timeouts) {
  const result = {};

  for (let key in globalTimeoutConfig) {
    result[key] = assign({}, globalTimeoutConfig[key], timeouts && timeouts[key] || {});
  }

  return result;
}

function toLoadPromise(appOrParcel) {
  return Promise.resolve().then(() => {
    if (appOrParcel.loadPromise) {
      return appOrParcel.loadPromise;
    }

    if (appOrParcel.status !== NOT_LOADED && appOrParcel.status !== LOAD_ERROR) {
      return appOrParcel;
    }

    let startTime;

    {
      startTime = performance.now();
    }

    appOrParcel.status = LOADING_SOURCE_CODE;
    let appOpts, isUserErr;
    return appOrParcel.loadPromise = Promise.resolve().then(() => {
      const loadPromise = appOrParcel.loadApp(getProps(appOrParcel));

      if (!smellsLikeAPromise(loadPromise)) {
        // The name of the app will be prepended to this error message inside of the handleAppError function
        isUserErr = true;
        throw Error(formatErrorMessage(33, `single-spa loading function did not return a promise. Check the second argument to registerApplication('${toName(appOrParcel)}', loadingFunction, activityFunction)`, toName(appOrParcel)));
      }

      return loadPromise.then(val => {
        appOrParcel.loadErrorTime = null;
        appOpts = val;
        let validationErrMessage, validationErrCode;

        if (typeof appOpts !== "object") {
          validationErrCode = 34;

          {
            validationErrMessage = `does not export anything`;
          }
        }

        if ( // ES Modules don't have the Object prototype
        Object.prototype.hasOwnProperty.call(appOpts, "bootstrap") && !validLifecycleFn(appOpts.bootstrap)) {
          validationErrCode = 35;

          {
            validationErrMessage = `does not export a valid bootstrap function or array of functions`;
          }
        }

        if (!validLifecycleFn(appOpts.mount)) {
          validationErrCode = 36;

          {
            validationErrMessage = `does not export a mount function or array of functions`;
          }
        }

        if (!validLifecycleFn(appOpts.unmount)) {
          validationErrCode = 37;

          {
            validationErrMessage = `does not export a unmount function or array of functions`;
          }
        }

        const type = objectType(appOpts);

        if (validationErrCode) {
          let appOptsStr;

          try {
            appOptsStr = JSON.stringify(appOpts);
          } catch (_unused) {}

          console.error(formatErrorMessage(validationErrCode, `The loading function for single-spa ${type} '${toName(appOrParcel)}' resolved with the following, which does not have bootstrap, mount, and unmount functions`, type, toName(appOrParcel), appOptsStr), appOpts);
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
    }).catch(err => {
      delete appOrParcel.loadPromise;
      let newStatus;

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

const isInBrowser = typeof window !== "undefined";

/* We capture navigation event listeners so that we can make sure
 * that application navigation listeners are not called until
 * single-spa has ensured that the correct applications are
 * unmounted and mounted.
 */

const capturedEventListeners = {
  hashchange: [],
  popstate: []
};
const routingEventsListeningTo = ["hashchange", "popstate"];
function navigateToUrl(obj) {
  let url;

  if (typeof obj === "string") {
    url = obj;
  } else if (this && this.href) {
    url = this.href;
  } else if (obj && obj.currentTarget && obj.currentTarget.href && obj.preventDefault) {
    url = obj.currentTarget.href;
    obj.preventDefault();
  } else {
    throw Error(formatErrorMessage(14, `singleSpaNavigate/navigateToUrl must be either called with a string url, with an <a> tag as its context, or with an event whose currentTarget is an <a> tag`));
  }

  const current = parseUri(window.location.href);
  const destination = parseUri(url);

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
  if (eventArguments) {
    const eventType = eventArguments[0].type;

    if (routingEventsListeningTo.indexOf(eventType) >= 0) {
      capturedEventListeners[eventType].forEach(listener => {
        try {
          // The error thrown by application event listener should not break single-spa down.
          // Just like https://github.com/single-spa/single-spa/blob/85f5042dff960e40936f3a5069d56fc9477fac04/src/navigation/reroute.js#L140-L146 did
          listener.apply(this, eventArguments);
        } catch (e) {
          setTimeout(() => {
            throw e;
          });
        }
      });
    }
  }
}
let urlRerouteOnly;

function urlReroute() {
  reroute([], arguments);
}

function patchedUpdateState(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href;
    const result = updateState.apply(this, arguments);
    const urlAfter = window.location.href;

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
  let evt;

  try {
    evt = new PopStateEvent("popstate", {
      state
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

let originalReplaceState = null;
let historyApiIsPatched = false; // We patch the history API so single-spa is notified of all calls to pushState/replaceState.
// We patch addEventListener/removeEventListener so we can capture all popstate/hashchange event listeners,
// and delay calling them until single-spa has finished mounting/unmounting applications

function patchHistoryApi(opts) {
  if (historyApiIsPatched) {
    throw Error(formatErrorMessage(43, `single-spa: patchHistoryApi() was called after the history api was already patched.`));
  } // True by default, as a performance optimization that reduces
  // the number of extraneous popstate events


  urlRerouteOnly = opts && opts.hasOwnProperty("urlRerouteOnly") ? opts.urlRerouteOnly : true;
  historyApiIsPatched = true;
  originalReplaceState = window.history.replaceState; // We will trigger an app change for any routing events.

  window.addEventListener("hashchange", urlReroute);
  window.addEventListener("popstate", urlReroute); // Monkeypatch addEventListener so that we can ensure correct timing

  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  window.addEventListener = function (eventName, fn) {
    if (typeof fn === "function") {
      if (routingEventsListeningTo.indexOf(eventName) >= 0 && !find(capturedEventListeners[eventName], listener => listener === fn)) {
        capturedEventListeners[eventName].push(fn);
        return;
      }
    }

    return originalAddEventListener.apply(this, arguments);
  };

  window.removeEventListener = function (eventName, listenerFn) {
    if (typeof listenerFn === "function") {
      if (routingEventsListeningTo.indexOf(eventName) >= 0) {
        capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(fn => fn !== listenerFn);
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
  const anchor = document.createElement("a");
  anchor.href = str;
  return anchor;
}

let hasInitialized = false;
function ensureJQuerySupport(jQuery = window.jQuery) {
  if (!jQuery) {
    if (window.$ && window.$.fn && window.$.fn.jquery) {
      jQuery = window.$;
    }
  }

  if (jQuery && !hasInitialized) {
    const originalJQueryOn = jQuery.fn.on;
    const originalJQueryOff = jQuery.fn.off;

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

  const eventNames = eventString.split(/\s+/);
  eventNames.forEach(eventName => {
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

const appsToUnload = {};
function toUnloadPromise(appOrParcel) {
  return Promise.resolve().then(() => {
    const unloadInfo = appsToUnload[toName(appOrParcel)];

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
      return unloadInfo.promise.then(() => appOrParcel);
    }

    if (appOrParcel.status !== NOT_MOUNTED && appOrParcel.status !== LOAD_ERROR) {
      /* The app cannot be unloaded until it is unmounted.
       */
      return appOrParcel;
    }

    let startTime;

    {
      startTime = performance.now();
    }

    const unloadPromise = appOrParcel.status === LOAD_ERROR ? Promise.resolve() : reasonableTime(appOrParcel, "unload");
    appOrParcel.status = UNLOADING;
    return unloadPromise.then(() => {
      {
        addProfileEntry("application", toName(appOrParcel), "unload", startTime, performance.now(), true);
      }

      finishUnloadingApp(appOrParcel, unloadInfo);
      return appOrParcel;
    }).catch(err => {
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
    app,
    resolve,
    reject
  };
  Object.defineProperty(appsToUnload[toName(app)], "promise", {
    get: promiseGetter
  });
}
function getAppUnloadInfo(appName) {
  return appsToUnload[appName];
}

const apps = [];
function getAppChanges() {
  const appsToUnload = [],
        appsToUnmount = [],
        appsToLoad = [],
        appsToMount = []; // We re-attempt to download applications in LOAD_ERROR after a timeout of 200 milliseconds

  const currentTime = new Date().getTime();
  apps.forEach(app => {
    const appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);

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
    appsToUnload,
    appsToUnmount,
    appsToLoad,
    appsToMount
  };
}
function getMountedApps() {
  return apps.filter(isActive).map(toName);
}
function getAppNames() {
  return apps.map(toName);
} // used in devtools, not (currently) exposed as a single-spa API

function getRawAppData() {
  return [...apps];
}
function getAppStatus(appName) {
  const app = find(apps, app => toName(app) === appName);
  return app ? app.status : null;
}
let startWarningInitialized = false;
function registerApplication(appNameOrConfig, appOrLoadApp, activeWhen, customProps) {
  const registration = sanitizeArguments(appNameOrConfig, appOrLoadApp, activeWhen, customProps);

  if (!isStarted() && !startWarningInitialized) {
    startWarningInitialized = true;
    setTimeout(() => {
      if (!isStarted()) {
        console.warn(formatErrorMessage(1, `singleSpa.start() has not been called, 5000ms after single-spa was loaded. Before start() is called, apps can be declared and loaded, but not bootstrapped or mounted.`));
      }
    }, 5000);
  }

  if (getAppNames().indexOf(registration.name) !== -1) throw Error(formatErrorMessage(21, `There is already an app registered with name ${registration.name}`, registration.name));
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
function checkActivityFunctions(location = window.location) {
  return apps.filter(app => app.activeWhen(location)).map(toName);
}
function unregisterApplication(appName) {
  if (apps.filter(app => toName(app) === appName).length === 0) {
    throw Error(formatErrorMessage(25, `Cannot unregister application '${appName}' because no such application has been registered`, appName));
  } // See https://github.com/single-spa/single-spa/issues/871 for why waitForUnmount is false


  return unloadApplication(appName, {
    waitForUnmount: false
  }).then(() => {
    const appIndex = apps.map(toName).indexOf(appName);
    apps.splice(appIndex, 1);
  });
}
function unloadApplication(appName, opts = {
  waitForUnmount: false
}) {
  if (typeof appName !== "string") {
    throw Error(formatErrorMessage(26, `unloadApplication requires a string 'appName'`));
  }

  const app = find(apps, App => toName(App) === appName);

  if (!app) {
    throw Error(formatErrorMessage(27, `Could not unload application '${appName}' because no such application has been registered`, appName));
  }

  const appUnloadInfo = getAppUnloadInfo(toName(app));

  if (opts && opts.waitForUnmount) {
    // We need to wait for unmount before unloading the app
    if (appUnloadInfo) {
      // Someone else is already waiting for this, too
      return appUnloadInfo.promise;
    } else {
      // We're the first ones wanting the app to be resolved.
      const promise = new Promise((resolve, reject) => {
        addAppToUnload(app, () => promise, resolve, reject);
      });
      return promise;
    }
  } else {
    /* We should unmount the app, unload it, and remount it immediately.
     */
    let resultPromise;

    if (appUnloadInfo) {
      // Someone else is already waiting for this app to unload
      resultPromise = appUnloadInfo.promise;
      immediatelyUnloadApp(app, appUnloadInfo.resolve, appUnloadInfo.reject);
    } else {
      // We're the first ones wanting the app to be resolved.
      resultPromise = new Promise((resolve, reject) => {
        addAppToUnload(app, () => resultPromise, resolve, reject);
        immediatelyUnloadApp(app, resolve, reject);
      });
    }

    return resultPromise;
  }
}

function immediatelyUnloadApp(app, resolve, reject) {
  Promise.resolve().then(() => {
    // Before unmounting the application, we first must wait for it to finish mounting
    // Otherwise, the test for issue 871 in unregister-application.spec.js fails because
    // the application isn't really unmounted.
    if (find(checkActivityFunctions(), activeApp => activeApp === toName(app))) {
      return triggerAppChange();
    }
  }).then(() => {
    return toUnmountPromise(app).then(toUnloadPromise).then(() => {
      resolve();
      setTimeout(() => {
        // reroute, but the unload promise is done
        reroute();
      });
    });
  }).catch(reject);
}

function validateRegisterWithArguments(name, appOrLoadApp, activeWhen, customProps) {
  if (typeof name !== "string" || name.length === 0) throw Error(formatErrorMessage(20, `The 1st argument to registerApplication must be a non-empty string 'appName'`));
  if (!appOrLoadApp) throw Error(formatErrorMessage(23, "The 2nd argument to registerApplication must be an application or loading application function"));
  if (typeof activeWhen !== "function") throw Error(formatErrorMessage(24, "The 3rd argument to registerApplication must be an activeWhen function"));
  if (!validCustomProps(customProps)) throw Error(formatErrorMessage(22, "The optional 4th argument is a customProps and must be an object"));
}

function validateRegisterWithConfig(config) {
  if (Array.isArray(config) || config === null) throw Error(formatErrorMessage(39, "Configuration object can't be an Array or null!"));
  const validKeys = ["name", "app", "activeWhen", "customProps"];
  const invalidKeys = Object.keys(config).reduce((invalidKeys, prop) => validKeys.indexOf(prop) >= 0 ? invalidKeys : invalidKeys.concat(prop), []);
  if (invalidKeys.length !== 0) throw Error(formatErrorMessage(38, `The configuration object accepts only: ${validKeys.join(", ")}. Invalid keys: ${invalidKeys.join(", ")}.`, validKeys.join(", "), invalidKeys.join(", ")));
  if (typeof config.name !== "string" || config.name.length === 0) throw Error(formatErrorMessage(20, "The config.name on registerApplication must be a non-empty string"));
  if (typeof config.app !== "object" && typeof config.app !== "function") throw Error(formatErrorMessage(20, "The config.app on registerApplication must be an application or a loading function"));

  const allowsStringAndFunction = activeWhen => typeof activeWhen === "string" || typeof activeWhen === "function";

  if (!allowsStringAndFunction(config.activeWhen) && !(Array.isArray(config.activeWhen) && config.activeWhen.every(allowsStringAndFunction))) throw Error(formatErrorMessage(24, "The config.activeWhen on registerApplication must be a string, function or an array with both"));
  if (!validCustomProps(config.customProps)) throw Error(formatErrorMessage(22, "The optional config.customProps must be an object"));
}

function validCustomProps(customProps) {
  return !customProps || typeof customProps === "function" || typeof customProps === "object" && customProps !== null && !Array.isArray(customProps);
}

function sanitizeArguments(appNameOrConfig, appOrLoadApp, activeWhen, customProps) {
  const usingObjectAPI = typeof appNameOrConfig === "object";
  const registration = {
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
    return () => Promise.resolve(loadApp);
  }

  return loadApp;
}

function sanitizeCustomProps(customProps) {
  return customProps ? customProps : {};
}

function sanitizeActiveWhen(activeWhen) {
  let activeWhenArray = Array.isArray(activeWhen) ? activeWhen : [activeWhen];
  activeWhenArray = activeWhenArray.map(activeWhenOrPath => typeof activeWhenOrPath === "function" ? activeWhenOrPath : pathToActiveWhen(activeWhenOrPath));
  return location => activeWhenArray.some(activeWhen => activeWhen(location));
}

function pathToActiveWhen(path, exactMatch) {
  const regex = toDynamicPathValidatorRegex(path, exactMatch);
  return location => {
    // compatible with IE10
    let origin = location.origin;

    if (!origin) {
      origin = `${location.protocol}//${location.host}`;
    }

    const route = location.href.replace(origin, "").replace(location.search, "").split("?")[0];
    return regex.test(route);
  };
}

function toDynamicPathValidatorRegex(path, exactMatch) {
  let lastIndex = 0,
      inDynamic = false,
      regexStr = "^";

  if (path[0] !== "/") {
    path = "/" + path;
  }

  for (let charIndex = 0; charIndex < path.length; charIndex++) {
    const char = path[charIndex];
    const startOfDynamic = !inDynamic && char === ":";
    const endOfDynamic = inDynamic && char === "/";

    if (startOfDynamic || endOfDynamic) {
      appendToRegex(charIndex);
    }
  }

  appendToRegex(path.length);
  return new RegExp(regexStr, "i");

  function appendToRegex(index) {
    const anyCharMaybeTrailingSlashRegex = "[^/]+/?";
    const commonStringSubPath = escapeStrRegex(path.slice(lastIndex, index));
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
        const suffix = exactMatch ? "" : ".*";
        regexStr = // use charAt instead as we could not use es6 method endsWith
        regexStr.charAt(regexStr.length - 1) === "/" ? `${regexStr}${suffix}$` : `${regexStr}(/${suffix})?(#.*)?$`;
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

let appChangeUnderway = false,
    peopleWaitingOnAppChange = [],
    currentUrl = isInBrowser && window.location.href;
function triggerAppChange() {
  // Call reroute with no arguments, intentionally
  return reroute();
}
function reroute(pendingPromises = [], eventArguments, silentNavigation = false) {
  if (appChangeUnderway) {
    return new Promise((resolve, reject) => {
      peopleWaitingOnAppChange.push({
        resolve,
        reject,
        eventArguments
      });
    });
  }

  let startTime, profilerKind;

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

  const {
    appsToUnload,
    appsToUnmount,
    appsToLoad,
    appsToMount
  } = getAppChanges();
  let appsThatChanged,
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

  function cancelNavigation(val = true) {
    const promise = typeof (val === null || val === void 0 ? void 0 : val.then) === "function" ? val : Promise.resolve(val);
    cancelPromises.push(promise.catch(err => {
      console.warn(Error(formatErrorMessage(42, `single-spa: A cancelNavigation promise rejected with the following value: ${err}`)));
      console.warn(err); // Interpret a Promise rejection to mean that the navigation should not be canceled

      return false;
    }));
  }

  function loadApps() {
    return Promise.resolve().then(() => {
      const loadPromises = appsToLoad.map(toLoadPromise);
      let succeeded;
      return Promise.all(loadPromises).then(callAllEventListeners) // there are no mounted apps, before start() is called, so we always return []
      .then(() => {
        {
          succeeded = true;
        }

        return [];
      }).catch(err => {
        {
          succeeded = false;
        }

        callAllEventListeners();
        throw err;
      }).finally(() => {
        {
          addProfileEntry("routing", "loadApps", profilerKind, startTime, performance.now(), succeeded);
        }
      });
    });
  }

  function performAppChanges() {
    return Promise.resolve().then(() => {
      // https://github.com/single-spa/single-spa/issues/545
      fireSingleSpaEvent(appsThatChanged.length === 0 ? "before-no-app-change" : "before-app-change", getCustomEventDetail(true));
      fireSingleSpaEvent("before-routing-event", getCustomEventDetail(true, {
        cancelNavigation
      }));
      return Promise.all(cancelPromises).then(cancelValues => {
        const navigationIsCanceled = cancelValues.some(v => v);

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

        const unloadPromises = appsToUnload.map(toUnloadPromise);
        const unmountUnloadPromises = appsToUnmount.map(toUnmountPromise).map(unmountPromise => unmountPromise.then(toUnloadPromise));
        const allUnmountPromises = unmountUnloadPromises.concat(unloadPromises);
        const unmountAllPromise = Promise.all(allUnmountPromises);
        let unmountFinishedTime;
        unmountAllPromise.then(() => {
          {
            unmountFinishedTime = performance.now();
            addProfileEntry("routing", "unmountAndUnload", profilerKind, startTime, performance.now(), true);
          }

          fireSingleSpaEvent("before-mount-routing-event", getCustomEventDetail(true));
        }, err => {
          {
            addProfileEntry("routing", "unmountAndUnload", profilerKind, startTime, performance.now(), true);
          }

          throw err;
        });
        /* We load and bootstrap apps while other apps are unmounting, but we
         * wait to mount the app until all apps are finishing unmounting
         */

        const loadThenMountPromises = appsToLoad.map(app => {
          return toLoadPromise(app).then(app => tryToBootstrapAndMount(app, unmountAllPromise));
        });
        /* These are the apps that are already bootstrapped and just need
         * to be mounted. They each wait for all unmounting apps to finish up
         * before they mount.
         */

        const mountPromises = appsToMount.filter(appToMount => appsToLoad.indexOf(appToMount) < 0).map(appToMount => {
          return tryToBootstrapAndMount(appToMount, unmountAllPromise);
        });
        return unmountAllPromise.catch(err => {
          callAllEventListeners();
          throw err;
        }).then(() => {
          /* Now that the apps that needed to be unmounted are unmounted, their DOM navigation
           * events (like hashchange or popstate) should have been cleaned up. So it's safe
           * to let the remaining captured event listeners to handle about the DOM event.
           */
          callAllEventListeners();
          return Promise.all(loadThenMountPromises.concat(mountPromises)).catch(err => {
            pendingPromises.forEach(promise => promise.reject(err));
            throw err;
          }).then(finishUpAndReturn).then(() => {
            {
              addProfileEntry("routing", "loadAndMount", profilerKind, unmountFinishedTime, performance.now(), true);
            }
          }, err => {
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
    const returnValue = getMountedApps();
    pendingPromises.forEach(promise => promise.resolve(returnValue));

    try {
      const appChangeEventName = appsThatChanged.length === 0 ? "no-app-change" : "app-change";
      fireSingleSpaEvent(appChangeEventName, getCustomEventDetail());
      fireSingleSpaEvent("routing-event", getCustomEventDetail());
    } catch (err) {
      /* We use a setTimeout because if someone else's event handler throws an error, single-spa
       * needs to carry on. If a listener to the event throws an error, it's their own fault, not
       * single-spa's.
       */
      setTimeout(() => {
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
      const nextPendingPromises = peopleWaitingOnAppChange;
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
      pendingPromises.forEach(pendingPromise => {
        callCapturedEventListeners(pendingPromise.eventArguments);
      });
      callCapturedEventListeners(eventArguments);
    }
  }

  function getCustomEventDetail(isBeforeChanges = false, extraProperties) {
    const newAppStatuses = {};
    const appsByNewStatus = {
      // for apps that were mounted
      [MOUNTED]: [],
      // for apps that were unmounted
      [NOT_MOUNTED]: [],
      // apps that were forcibly unloaded
      [NOT_LOADED]: [],
      // apps that attempted to do something but are broken now
      [SKIP_BECAUSE_BROKEN]: []
    };

    if (isBeforeChanges) {
      appsToLoad.concat(appsToMount).forEach((app, index) => {
        addApp(app, MOUNTED);
      });
      appsToUnload.forEach(app => {
        addApp(app, NOT_LOADED);
      });
      appsToUnmount.forEach(app => {
        addApp(app, NOT_MOUNTED);
      });
    } else {
      appsThatChanged.forEach(app => {
        addApp(app);
      });
    }

    const result = {
      detail: {
        newAppStatuses,
        appsByNewStatus,
        totalAppChanges: appsThatChanged.length,
        originalEvent: eventArguments === null || eventArguments === void 0 ? void 0 : eventArguments[0],
        oldUrl,
        newUrl
      }
    };

    if (extraProperties) {
      assign(result.detail, extraProperties);
    }

    return result;

    function addApp(app, status) {
      const appName = toName(app);
      status = status || getAppStatus(appName);
      newAppStatuses[appName] = status;
      const statusArr = appsByNewStatus[status] = appsByNewStatus[status] || [];
      statusArr.push(appName);
    }
  }

  function fireSingleSpaEvent(name, eventProperties) {
    // During silent navigation (caused by navigation cancelation), we should not
    // fire any single-spa events
    if (!silentNavigation) {
      window.dispatchEvent(new customEvent(`single-spa:${name}`, eventProperties));
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
    return toBootstrapPromise(app).then(app => unmountAllPromise.then(() => shouldBeActive(app) ? toMountPromise(app) : app));
  } else {
    return unmountAllPromise.then(() => app);
  }
}

let started = false;
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
  getRawAppData,
  reroute,
  NOT_LOADED,
  toLoadPromise,
  toBootstrapPromise,
  unregisterApplication,
  getProfilerData
};

if (isInBrowser && window.__SINGLE_SPA_DEVTOOLS__) {
  window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = devtools;
}

export { BOOTSTRAPPING, LOADING_SOURCE_CODE, LOAD_ERROR, MOUNTED, MOUNTING, NOT_BOOTSTRAPPED, NOT_LOADED, NOT_MOUNTED, SKIP_BECAUSE_BROKEN, UNMOUNTING, UPDATING, addErrorHandler, checkActivityFunctions, ensureJQuerySupport, getAppNames, getAppStatus, getMountedApps, getProfilerData, mountRootParcel, navigateToUrl, patchHistoryApi, pathToActiveWhen, registerApplication, removeErrorHandler, setBootstrapMaxTime, setMountMaxTime, setUnloadMaxTime, setUnmountMaxTime, start, triggerAppChange, unloadApplication, unregisterApplication };
//# sourceMappingURL=single-spa.dev.js.map
