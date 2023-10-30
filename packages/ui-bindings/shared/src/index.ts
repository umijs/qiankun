import type { AppConfiguration, MicroApp as MicroAppTypeDefinition, LifeCycles } from 'qiankun';

export type MicroAppType = {
  _unmounting?: boolean;
  _updatingPromise?: Promise<null>;
  _updatingTimestamp?: number;
} & MicroAppTypeDefinition;

export type SharedProps = {
  name: string;
  entry: string;
  settings?: AppConfiguration;
  lifeCycles?: LifeCycles<Record<string, unknown>>;

  autoSetLoading?: boolean;
  autoCaptureError?: boolean;
  // 仅开启 loader 时需要
  wrapperClassName?: string;
  className?: string;
};

export type SharedSlots<T> = {
  loader?: (loading: boolean) => T;
  errorBoundary?: (error: Error) => T;
};

export async function unmountMicroApp(microApp: MicroAppType) {
  await microApp.mountPromise.then(() => microApp.unmount());
}
