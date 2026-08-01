export { start } from "./start";
export type { StartOpts } from "./start";
export { ensureJQuerySupport } from "./jquery-support";
export {
  setInitMaxTime,
  setMountMaxTime,
  setUnmountMaxTime,
  setUnloadMaxTime,
} from "./applications/timeouts";
export {
  registerApplication,
  unregisterApplication,
  getMountedApps,
  getAppStatus,
  unloadApplication,
  checkActivityFunctions,
  getAppNames,
  pathToActiveWhen,
} from "./applications/apps";
export { navigateToUrl, patchHistoryApi } from "./navigation/navigation-events";
export { triggerAppChange } from "./navigation/reroute";
export {
  addErrorHandler,
  removeErrorHandler,
  type SingleSpaError,
  type ErrorHandler,
} from "./applications/app-errors";
export { mountRootParcel } from "./parcels/mount-parcel";
export type {
  CustomProps,
  ParcelCustomProps,
  CustomPropsFn,
  AppProps,
  ParcelConfig,
  ParcelConfigObject,
  LifeCycles,
  LifeCycleFn,
  Parcel,
  Application,
  LoadApp,
  ActivityFn,
  Activity,
  RegisterApplicationConfig,
} from "./lifecycles/lifecycle.helpers";

export { AppOrParcelStatus } from "./applications/app.helpers";

import devtools from "./devtools/devtools";
import { isInBrowser } from "./utils/runtime-environment";

if (isInBrowser && window.__SINGLE_SPA_DEVTOOLS__) {
  window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = devtools;
}

declare global {
  interface Window {
    __SINGLE_SPA_DEVTOOLS__: {
      exposedMethods: typeof devtools;
    };
  }
}
