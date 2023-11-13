import type { AppConfiguration, MicroApp as MicroAppTypeDefinition, LifeCycles } from 'qiankun';
import { loadMicroApp } from 'qiankun';
import { mergeWith, concat, omit } from 'lodash';
import type { LifeCycleFn } from 'qiankun';

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

export const omitSharedProps = (props: Partial<SharedProps>) => {
  return omit(props, ['wrapperClassName', 'className', 'lifeCycles', 'settings', 'entry', 'name']);
};

export function mountMicroApp({
  setLoading,
  setError,
  setMicroApp,
  container,
  props,
}: {
  setLoading?: (loading: boolean) => void;
  setError?: (error?: Error) => void;
  setMicroApp?: (app?: MicroAppType) => void;
  props: SharedProps;
  container: HTMLDivElement;
}) {
  const propsFromParams = omitSharedProps(props);

  setError?.(undefined);
  setLoading?.(true);

  const configuration = {
    globalContext: window,
    ...(props.settings || {}),
  };

  const microApp = loadMicroApp(
    {
      name: props.name,
      entry: props.entry,
      container,
      props: propsFromParams,
    },
    configuration,
    mergeWith(
      {},
      props.lifeCycles,
      (v1: LifeCycleFn<Record<string, unknown>>, v2: LifeCycleFn<Record<string, unknown>>) => concat(v1, v2),
    ),
  );

  setMicroApp?.(microApp);

  microApp.mountPromise
    .then(() => {
      if (props.autoSetLoading) {
        setLoading?.(false);
      }
    })
    .catch((err: Error) => {
      setError?.(err);
      setLoading?.(false);
    });

  (['loadPromise', 'bootstrapPromise'] as const).forEach((key) => {
    const promise = microApp[key];

    promise.catch((e: Error) => {
      setError?.(e);
      setLoading?.(false);
    });
  });
}

export function updateMicroApp({
  name,
  getMicroApp,
  setLoading,
  propsFromParams,
  key,
}: {
  name?: string;
  getMicroApp?: () => MicroAppType | undefined;
  setLoading?: (loading: boolean) => void;
  propsFromParams?: Record<string, unknown>;
  key?: string;
}) {
  const microApp = getMicroApp?.();

  if (microApp) {
    if (!microApp._updatingPromise) {
      // 初始化 updatingPromise 为 microApp.mountPromise，从而确保后续更新是在应用 mount 完成之后
      microApp._updatingPromise = microApp.mountPromise;
      microApp._updatingTimestamp = Date.now();
    } else {
      // 确保 microApp.update 调用是跟组件状态变更顺序一致的，且后一个微应用更新必须等待前一个更新完成
      microApp._updatingPromise = microApp._updatingPromise.then(() => {
        const canUpdate = (app: MicroAppType) => app.update && app.getStatus() === 'MOUNTED' && !app._unmounting;
        if (canUpdate(microApp)) {
          const props = {
            ...propsFromParams,
            setLoading(l: boolean) {
              setLoading?.(l);
            },
          };

          if (process.env.NODE_ENV === 'development') {
            const updatingTimestamp = microApp._updatingTimestamp!;
            if (Date.now() - updatingTimestamp < 200) {
              console.warn(
                `[@qiankunjs/${key}] It seems like microApp ${name} is updating too many times in a short time(200ms), you may need to do some optimization to avoid the unnecessary re-rendering.`,
              );
            }

            console.info(`[@qiankunjs/${key}] MicroApp ${name} is updating with props: `, props);
            microApp._updatingTimestamp = Date.now();
          }

          // 返回 microApp.update 形成链式调用
          return microApp.update?.(props);
        }

        return void 0;
      });
    }
  }
}
