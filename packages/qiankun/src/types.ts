/**
 * @author Kuitos
 * @since 2023-04-25
 */
import type { Parcel } from 'single-spa';

export type ObjectType = Record<string, any>;

export type Entry = string;

type AppMetadata = {
  // app name
  name: string;
  // app entry
  entry: Entry;
};

// just for manual loaded apps, in single-spa it called parcel
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  // where the app mount to, mutual exclusive with the legacy custom render function
  container: HTMLElement;
  // props pass to app
  props?: T;
};

export type AppConfiguration = {
  fetch?: typeof window.fetch;
  sandbox?: boolean;
};

type LifeCycleFn<T extends ObjectType> = (app: LoadableApp<T>, global: typeof window) => Promise<any>;
export type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app load
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app mount
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function after app mount
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app unmount
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function after app unmount
};

export type MicroApp = Parcel;
