import { getProps } from "../lifecycles/prop.helpers";
import { objectType, toName } from "./app.helpers";
import { formatErrorMessage } from "./app-errors";
import { AppOrParcel } from "../lifecycles/lifecycle.helpers";

export interface AppOrParcelTimeouts {
  init: Timeout;
  mount: Timeout;
  unmount: Timeout;
  unload: Timeout;
  update: Timeout;
}

export interface Timeout {
  millis: number;
  dieOnTimeout: boolean;
  warningMillis: number;
}

const defaultWarningMillis: number = 1000;

const globalTimeoutConfig: AppOrParcelTimeouts = {
  init: {
    millis: 4000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
  mount: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
  unmount: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
  unload: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
  update: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
};

export function setInitMaxTime(
  time: number,
  dieOnTimeout: boolean,
  warningMillis: number,
): void {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      formatErrorMessage(
        16,
        __DEV__ &&
          `init max time must be a positive integer number of milliseconds`,
      ),
    );
  }

  globalTimeoutConfig.init = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis,
  };
}

export function setMountMaxTime(
  time: number,
  dieOnTimeout: boolean,
  warningMillis: number,
): void {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      formatErrorMessage(
        17,
        __DEV__ &&
          `mount max time must be a positive integer number of milliseconds`,
      ),
    );
  }

  globalTimeoutConfig.mount = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis,
  };
}

export function setUnmountMaxTime(
  time: number,
  dieOnTimeout: boolean,
  warningMillis: number,
) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      formatErrorMessage(
        18,
        __DEV__ &&
          `unmount max time must be a positive integer number of milliseconds`,
      ),
    );
  }

  globalTimeoutConfig.unmount = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis,
  };
}

export function setUnloadMaxTime(
  time: number,
  dieOnTimeout: boolean,
  warningMillis: number,
) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      formatErrorMessage(
        19,
        __DEV__ &&
          `unload max time must be a positive integer number of milliseconds`,
      ),
    );
  }

  globalTimeoutConfig.unload = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis,
  };
}

export function reasonableTime(
  appOrParcel: AppOrParcel,
  lifecycle: "init" | "mount" | "update" | "unmount" | "unload",
): Promise<any> {
  const timeoutConfig = appOrParcel.timeouts[lifecycle];
  const warningPeriod = timeoutConfig.warningMillis;
  const type = objectType(appOrParcel);

  return new Promise((resolve, reject) => {
    let finished: boolean = false;
    let errored: boolean = false;

    appOrParcel[lifecycle](getProps(appOrParcel))
      .then((val) => {
        finished = true;
        resolve(val);
      })
      .catch((val) => {
        finished = true;
        reject(val);
      });

    setTimeout(() => maybeTimingOut(1), warningPeriod);
    setTimeout(() => maybeTimingOut(true), timeoutConfig.millis);

    const errMsg = formatErrorMessage(
      31,
      __DEV__ &&
        `Lifecycle function ${lifecycle} for ${type} ${toName(
          appOrParcel,
        )} lifecycle did not resolve or reject for ${timeoutConfig.millis} ms.`,
      lifecycle,
      type,
      toName(appOrParcel),
      timeoutConfig.millis,
    );

    function maybeTimingOut(shouldError: true | number) {
      if (!finished) {
        if (shouldError === true) {
          errored = true;
          if (timeoutConfig.dieOnTimeout) {
            reject(Error(errMsg));
          } else {
            console.error(errMsg);
            //don't resolve or reject, we're waiting this one out
          }
        } else if (!errored) {
          const numWarnings: number = shouldError;
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

export function ensureValidAppTimeouts(
  timeouts: Partial<AppOrParcelTimeouts>,
): AppOrParcelTimeouts {
  const result = {};

  for (let key in globalTimeoutConfig) {
    result[key] = Object.assign(
      {},
      globalTimeoutConfig[key],
      timeouts?.[key] ?? {},
    );
  }

  return result as AppOrParcelTimeouts;
}
