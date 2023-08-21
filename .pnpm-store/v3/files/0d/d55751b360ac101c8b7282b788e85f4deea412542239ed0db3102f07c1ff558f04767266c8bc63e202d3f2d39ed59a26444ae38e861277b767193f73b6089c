declare module "single-spa" {
  interface CustomProps {
    [str: string]: any;
    [num: number]: any;
  }

  type CustomPropsFn<ExtraProps extends CustomProps = CustomProps> = (
    name: string,
    location: Location
  ) => ExtraProps;

  export type AppProps = {
    name: string;
    singleSpa: any;
    mountParcel(
      parcelConfig: ParcelConfig,
      customProps: ParcelProps & CustomProps
    ): Parcel;
  };

  export type ParcelConfig<ExtraProps = CustomProps> =
    | ParcelConfigObject<ExtraProps>
    | (() => Promise<ParcelConfigObject<ExtraProps>>);

  type ParcelProps = { domElement: HTMLElement };
  type ParcelConfigObject<ExtraProps = CustomProps> = {
    name?: string;
  } & LifeCycles<ExtraProps>;

  type Parcel<ExtraProps = CustomProps> = {
    mount(): Promise<null>;
    unmount(): Promise<null>;
    update?(customProps: ExtraProps): Promise<any>;
    getStatus():
      | "NOT_LOADED"
      | "LOADING_SOURCE_CODE"
      | "NOT_BOOTSTRAPPED"
      | "BOOTSTRAPPING"
      | "NOT_MOUNTED"
      | "MOUNTING"
      | "MOUNTED"
      | "UPDATING"
      | "UNMOUNTING"
      | "UNLOADING"
      | "SKIP_BECAUSE_BROKEN"
      | "LOAD_ERROR";
    loadPromise: Promise<null>;
    bootstrapPromise: Promise<null>;
    mountPromise: Promise<null>;
    unmountPromise: Promise<null>;
  };

  type LifeCycleFn<ExtraProps> = (
    config: ExtraProps & AppProps
  ) => Promise<any>;
  export type LifeCycles<ExtraProps = {}> = {
    bootstrap: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
    mount: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
    unmount: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
    update?: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
  };

  export type StartOpts = {
    urlRerouteOnly?: boolean;
  };

  // ./start.js
  export function start(opts?: StartOpts): void;

  // ./jquery-support.js
  export function ensureJQuerySupport(jQuery?: any): void;

  // ./applications/timeouts.js
  export function setBootstrapMaxTime(
    time: number,
    dieOnTimeout?: boolean
  ): void;
  export function setMountMaxTime(time: number, dieOnTimeout?: boolean): void;
  export function setUnmountMaxTime(time: number, dieOnTimeout?: boolean): void;
  export function setUnloadMaxTime(time: number, dieOnTimeout?: boolean): void;

  type Application<ExtraProps = {}> =
    | LifeCycles<ExtraProps>
    | ((config: ExtraProps & AppProps) => Promise<LifeCycles<ExtraProps>>);

  type ActivityFn = (location: Location) => boolean;

  type Activity = ActivityFn | string | (ActivityFn | string)[];

  export type RegisterApplicationConfig<ExtraProps extends CustomProps = {}> = {
    name: string;
    app: Application<ExtraProps>;
    activeWhen: Activity;
    customProps?: ExtraProps | CustomPropsFn<ExtraProps>;
  };

  interface SingleSpaNewAppStatus {
    [key: string]:
      | "MOUNTED"
      | "NOT_MOUNTED"
      | "NOT_LOADED"
      | "SKIP_BECAUSE_BROKEN";
  }
  interface SingleSpaAppsByNewStatus {
    [MOUNTED]: string[];
    [NOT_MOUNTED]: string[];
    [NOT_LOADED]: string[];
    [SKIP_BECAUSE_BROKEN]: string[];
  }
  export type SingleSpaCustomEventDetail = {
    newAppStatuses: SingleSpaNewAppStatus;
    appsByNewStatus: SingleSpaAppsByNewStatus;
    totalAppChanges: number;
    originalEvent?: Event;
    oldUrl: string;
    newUrl: string;
    navigationIsCanceled: boolean;
    cancelNavigation?: () => void;
  };

  // ./applications/apps.js
  export function registerApplication<ExtraProps extends CustomProps = {}>(
    appName: string,
    applicationOrLoadingFn: Application<ExtraProps>,
    activityFn: ActivityFn,
    customProps?: ExtraProps | CustomPropsFn<ExtraProps>
  ): void;

  export function registerApplication<ExtraProps extends CustomProps = {}>(
    config: RegisterApplicationConfig<ExtraProps>
  ): void;

  export function unregisterApplication(appName: string): Promise<any>;

  export function getMountedApps(): string[];

  export const {
    NOT_LOADED = "NOT_LOADED",
    LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE",
    NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED",
    BOOTSTRAPPING = "BOOTSTRAPPING",
    NOT_MOUNTED = "NOT_MOUNTED",
    MOUNTING = "MOUNTING",
    MOUNTED = "MOUNTED",
    UPDATING = "UPDATING",
    UNMOUNTING = "UNMOUNTING",
    UNLOADING = "UNLOADING",
    SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN",
    LOAD_ERROR = "LOAD_ERROR",
  };

  export function getAppStatus(appName: string): string | null;

  export function unloadApplication(
    appName: string,
    opts?: { waitForUnmount: boolean }
  ): Promise<any>;

  export function checkActivityFunctions(location: Location): string[];
  export function getAppNames(): string[];

  // ./navigation/navigation-events.js'
  export function navigateToUrl(
    obj:
      | string
      | {
          currentTarget: {
            href: string;
          };
          preventDefault: any;
        },
    opts?: Object
  ): void;

  // './navigation/reroute.js'
  export function triggerAppChange(): Promise<any>;

  // './applications/app-errors.js'
  type AppError = Error & {
    appOrParcelName: string;
  };
  export function addErrorHandler(handler: (error: AppError) => void): void;
  export function removeErrorHandler(handler: (error: AppError) => void): void;

  // './parcels/mount-parcel.js'
  export function mountRootParcel<ExtraProps = CustomProps>(
    parcelConfig: ParcelConfig<ExtraProps>,
    parcelProps: ParcelProps & ExtraProps
  ): Parcel<ExtraProps>;

  export function pathToActiveWhen(
    path: string,
    exactMatch?: boolean
  ): ActivityFn;

  export function patchHistoryApi(opts?: StartOpts): void;
}
