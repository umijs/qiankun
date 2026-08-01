import {
  toName,
  AppOrParcelStatus,
  InternalApplication,
  AppDevtools,
} from "../applications/app.helpers";
import { formatErrorMessage } from "../applications/app-errors";
import { AppOrParcelTimeouts } from "../applications/timeouts";

export function validLifecycleFn(
  fn: LifeCycleFn<unknown> | LifeCycleFn<unknown>[],
): boolean {
  return fn && (typeof fn === "function" || isArrayOfFns(fn));

  function isArrayOfFns(arr) {
    return (
      Array.isArray(arr) && !arr.find((item) => typeof item !== "function")
    );
  }
}

export function flattenFnArray(
  appOrParcel: LifeCycles<unknown>,
  lifecycle: string,
  isParcel: boolean,
): LifeCycleFn<unknown> {
  let fns: LifeCycleFn<unknown>[] = Array.isArray(appOrParcel[lifecycle])
    ? (appOrParcel[lifecycle] as LifeCycleFn<unknown>[])
    : [appOrParcel[lifecycle] as LifeCycleFn<unknown>].filter(Boolean);
  if (fns.length === 0) {
    fns = [() => Promise.resolve()];
  }

  const type = isParcel ? "parcel" : "application";
  const name = toName(appOrParcel);

  return function (props: AppProps): Promise<unknown> {
    return fns.reduce((resultPromise, fn, index) => {
      return resultPromise.then(() => {
        const thisPromise = fn(props);
        return smellsLikeAPromise(thisPromise)
          ? thisPromise
          : Promise.reject(
              formatErrorMessage(
                15,
                __DEV__ &&
                  `Within ${type} ${name}, the lifecycle function ${lifecycle} at array index ${index} did not return a promise`,
                type,
                name,
                lifecycle,
                index,
              ),
            );
      });
    }, Promise.resolve());
  };
}

export function smellsLikeAPromise(promise) {
  return (
    promise &&
    typeof promise.then === "function" &&
    typeof promise.catch === "function"
  );
}

export interface CustomProps {
  [str: string]: any;
  [num: number]: any;
}

export interface ParcelCustomProps extends CustomProps {
  domElement: HTMLElement;
}

export type CustomPropsFn<ExtraProps extends CustomProps = CustomProps> = (
  name: string,
  location: Location,
) => ExtraProps;

export type AppProps = {
  name: string;
  mountParcel(
    parcelConfig: ParcelConfig,
    customProps: ParcelProps & CustomProps,
  ): Parcel;
};

export type ParcelConfig<ExtraProps = CustomProps> =
  | ParcelConfigObject<ExtraProps>
  | (() => Promise<ParcelConfigObject<ExtraProps>>);

type ParcelProps = { domElement: HTMLElement };
export type ParcelConfigObject<ExtraProps = CustomProps> = {
  name?: string;
  timeouts?: AppOrParcelTimeouts;
} & LifeCycles<ExtraProps>;

export type LifeCycleFn<ExtraProps> = (
  config: ExtraProps & AppProps,
) => Promise<any>;
export type LifeCycles<ExtraProps = {}> = {
  init?: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
  mount: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
  unmount: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
  update?: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
  unload?: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
  devtools?: AppDevtools;
  timeouts?: AppOrParcelTimeouts;
};

export type Parcel<ExtraProps = CustomProps> = {
  mount(): Promise<null>;
  unmount(): Promise<null>;
  update?(customProps: ExtraProps): Promise<any>;
  getStatus(): AppOrParcelStatus;
  loadPromise: Promise<null>;
  initPromise: Promise<null>;
  mountPromise: Promise<null>;
  unmountPromise: Promise<null>;
  // Intended for internal use only
  _parcel: InternalParcel;
};

export interface ParcelOwner {
  name: string;
  parcels: ParcelMap;
}

export interface ParcelMap {
  [parcelId: number]: InternalParcel;
}

// Intended for internal use only
export interface InternalParcel {
  id: number;
  name: string;
  init: LifeCycles["init"];
  mount: LifeCycles["mount"];
  unmount: LifeCycles["unmount"];
  update: LifeCycles["update"];
  parcels: ParcelMap;
  status: AppOrParcelStatus;
  customProps: CustomProps;
  parentName: string;
  unmountThisParcel(): Promise<AppOrParcel>;
  currentTask: Promise<LoadedAppOrParcel>;
  timeouts: AppOrParcelTimeouts;
}

export type AppOrParcel = InternalApplication | InternalParcel;

interface Loaded extends LifeCycles {
  // loadPromise sometimes bails early if there is an error,
  // which results in it being an InternalApplication
  loadPromise?: Promise<LoadedApp | InternalApplication>;
}

export type LoadedAppOrParcel =
  | (InternalApplication & Loaded)
  | (InternalParcel & Loaded);

export type LoadedApp = InternalApplication & Loaded;

export type Application<ExtraProps = {}> =
  | LifeCycles<ExtraProps>
  | LoadApp<ExtraProps>;

export type LoadApp<ExtraProps = {}> = (
  config: ExtraProps & AppProps,
) => Promise<LifeCycles<ExtraProps>>;

export interface SingleSpaLocation {
  pathname: URL["pathname"];
  hash?: URL["hash"];
  search?: string;
}

export type ActivityFn = (location: SingleSpaLocation) => boolean;

export type Activity = ActivityFn | string | (ActivityFn | string)[];

export type RegisterApplicationConfig<ExtraProps extends CustomProps = {}> = {
  name: string;
  app: Application<ExtraProps>;
  activeWhen: Activity;
  customProps?: ExtraProps | CustomPropsFn<ExtraProps>;
};
