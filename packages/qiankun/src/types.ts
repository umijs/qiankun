/**
 * @author Kuitos
 * @since 2023-04-25
 */
import type { LoaderOpts } from '@qiankunjs/loader';
import type { LifeCycles as ParcelLifeCycles, Parcel, RegisterApplicationConfig } from 'single-spa';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
    __QIANKUN_DEVELOPMENT__?: boolean;
    Zone?: CallableFunction;
    __zone_symbol__setTimeout?: Window['setTimeout'];
  }
}

export type ObjectType = Record<string, unknown>;

export type HTMLEntry = string;

type AppMetadata = {
  // app name
  name: string;
  // app entry
  entry: HTMLEntry;
};

// just for manual loaded apps, in single-spa it called parcel
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  // where the app mount to
  container: HTMLElement;
  // props pass to app
  props?: T;
};

// for the route-based apps
export type RegistrableApp<T extends ObjectType> = LoadableApp<T> & {
  loader?: (loading: boolean) => void;
  activeRule: RegisterApplicationConfig['activeWhen'];
};

export type AppConfiguration = Partial<Pick<LoaderOpts, 'fetch' | 'streamTransformer'>> & {
  sandbox?: boolean;
  globalContext?: WindowProxy;
};

export type LifeCycleFn<T extends ObjectType> = (app: LoadableApp<T>, global: WindowProxy) => Promise<void>;
export type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app load
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app mount
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function after app mount
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app unmount
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function after app unmount
};

export type MicroApp = Parcel;

type ExtraProps = {
  container: HTMLElement;
};
type FlattenArray<T> = T extends Array<infer U> ? U : T;
type FlattenArrayValue<T> = {
  [P in keyof T]: FlattenArray<T[P]>;
};

export type MicroAppLifeCycles = FlattenArrayValue<ParcelLifeCycles<ExtraProps>>;
