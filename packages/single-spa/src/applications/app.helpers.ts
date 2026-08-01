import {
  ActivityFn,
  AppOrParcel,
  CustomProps,
  InternalParcel,
  LoadApp,
  ParcelMap,
} from "../lifecycles/lifecycle.helpers";
import { handleAppError } from "./app-errors";
import { AppOrParcelTimeouts } from "./timeouts";

// App statuses
export enum AppOrParcelStatus {
  NOT_LOADED = "NOT_LOADED",
  LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE",
  NOT_INITIALIZED = "NOT_INITIALIZED",
  INITIALIZING = "INITIALIZING",
  NOT_MOUNTED = "NOT_MOUNTED",
  MOUNTING = "MOUNTING",
  MOUNTED = "MOUNTED",
  UPDATING = "UPDATING",
  UNMOUNTING = "UNMOUNTING",
  UNLOADING = "UNLOADING",
  LOAD_ERROR = "LOAD_ERROR",
  SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN",
}

export function isActive(app) {
  return app.status === AppOrParcelStatus.MOUNTED;
}

export function shouldBeActive(app) {
  try {
    return app.activeWhen(window.location);
  } catch (err) {
    handleAppError(err, app, AppOrParcelStatus.SKIP_BECAUSE_BROKEN);
    return false;
  }
}

export function toName(app) {
  return app.name;
}

export function isParcel(
  appOrParcel: AppOrParcel,
): appOrParcel is InternalParcel {
  return Boolean((appOrParcel as InternalParcel).unmountThisParcel);
}

export function objectType(appOrParcel: AppOrParcel): "parcel" | "application" {
  return isParcel(appOrParcel) ? "parcel" : "application";
}

export interface InternalApplication {
  name: string;
  activeWhen: ActivityFn;
  loadApp: LoadApp;
  status: AppOrParcelStatus;
  loadErrorTime: number;
  parcels: ParcelMap;
  customProps?: CustomProps;
  // The ensureValidAppTimeouts function gets called once the app is loaded
  timeouts?: AppOrParcelTimeouts;
  devtools: AppDevtools;
}

export interface AppDevtools {
  overlays: {
    options: OverlayOptions;
    selectors: string[];
  };
}

// https://github.com/single-spa/single-spa-inspector/blob/ac3e1ded68e94239dd02d04f8a094ed8e6dfefc2/src/inspected-window-helpers/overlay-helpers.js#L53
interface OverlayOptions {
  color?: string;
  background?: string;
  classes?: string[];
  height?: string;
  left?: string;
  position?: string;
  top?: string;
  width?: string;
  zIndex?: string | number;
  textColor?: string;
  textBlocks?: string[];
}
