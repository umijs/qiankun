import { AppOrParcel } from "../lifecycles/lifecycle.helpers";
import { AppOrParcelStatus, objectType, toName } from "./app.helpers";

let errorHandlers: ErrorHandler[] = [];

export type SingleSpaError = Error & {
  appOrParcelName: string;
};

export type ErrorHandler = (err: SingleSpaError) => any;

export function handleAppError(
  err: Error,
  app: AppOrParcel,
  newStatus: AppOrParcelStatus,
) {
  const transformedErr = transformErr(err, app, newStatus);

  if (errorHandlers.length) {
    errorHandlers.forEach((handler) => handler(transformedErr));
  } else {
    setTimeout(() => {
      throw transformedErr;
    });
  }
}

export function addErrorHandler(handler) {
  if (typeof handler !== "function") {
    throw Error(
      formatErrorMessage(
        28,
        __DEV__ && "a single-spa error handler must be a function",
      ),
    );
  }

  errorHandlers.push(handler);
}

export function removeErrorHandler(handler) {
  if (typeof handler !== "function") {
    throw Error(
      formatErrorMessage(
        29,
        __DEV__ && "a single-spa error handler must be a function",
      ),
    );
  }

  let removedSomething = false;
  errorHandlers = errorHandlers.filter((h) => {
    const isHandler = h === handler;
    removedSomething = removedSomething || isHandler;
    return !isHandler;
  });

  return removedSomething;
}

export function formatErrorMessage(code, msg, ...args) {
  return `single-spa minified message #${code}: ${
    msg ? msg + " " : ""
  }See https://single-spa.js.org/error/?code=${code}${
    args.length ? `&arg=${args.join("&arg=")}` : ""
  }`;
}

export function transformErr(
  ogErr: Error,
  appOrParcel: AppOrParcel,
  newStatus: AppOrParcelStatus,
): SingleSpaError {
  const errPrefix = `${objectType(appOrParcel)} '${toName(
    appOrParcel,
  )}' died in status ${appOrParcel.status}: `;

  let result: Error;

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
    console.warn(
      formatErrorMessage(
        30,
        __DEV__ &&
          `While ${appOrParcel.status}, '${toName(
            appOrParcel,
          )}' rejected its lifecycle function promise with a non-Error. This will cause stack traces to not be accurate.`,
        appOrParcel.status,
        toName(appOrParcel),
      ),
    );
    try {
      result = Error(errPrefix + JSON.stringify(ogErr));
    } catch (err) {
      // If it's not an Error and you can't stringify it, then what else can you even do to it?
      result = ogErr;
    }
  }

  const singleSpaErr = result as SingleSpaError;
  singleSpaErr.appOrParcelName = toName(appOrParcel);

  // We set the status after transforming the error so that the error message
  // references the state the application was in before the status change.
  appOrParcel.status = newStatus;

  return singleSpaErr;
}
