import type { AppConfiguration, MicroApp as MicroAppTypeDefinition, LifeCycles, LifeCycleFn } from 'qiankun';
import { loadMicroApp as originLoadMicroApp } from 'qiankun';
import { mergeWith, concat, omit } from 'lodash';

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

  externalQiankun?: boolean;
};

export type SharedSlots<T> = {
  loader?: (loading: boolean) => T;
  errorBoundary?: (error: Error) => T;
};

export const omitSharedProps = (props: Partial<SharedProps>) => {
  return omit(props, ['wrapperClassName', 'className', 'lifeCycles', 'settings', 'entry', 'name', 'externalQiankun']);
};

export async function mountMicroApp({
  prevMicroApp,
  container,
  componentProps,
  setLoading,
  setError,
}: {
  prevMicroApp?: MicroAppType;
  container: HTMLDivElement;
  componentProps: SharedProps;
  setLoading?: (loading: boolean) => void;
  setError?: (error?: Error) => void;
}) {
  if (!componentProps.name || !componentProps.entry) {
    console.error('the name and entry of MicroApp is needed');
    return;
  }

  // 等待 prevMicroApp 卸载完成
  if (prevMicroApp?._unmounting) {
    await prevMicroApp.unmountPromise;
  }

  setError?.(undefined);
  setLoading?.(true);

  const microAppProps = omitSharedProps(componentProps);
  const configuration = {
    globalContext: window,
    ...(componentProps.settings || {}),
  };

  let loadMicroApp = originLoadMicroApp;
  if (componentProps.externalQiankun) {
    console.warn('the qiankun is external');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loadMicroApp = (window.qiankun as unknown)?.loadMicroApp as typeof originLoadMicroApp;
  }

  const microApp = loadMicroApp(
    {
      name: componentProps.name,
      entry: componentProps.entry,
      container,
      props: microAppProps,
    },
    configuration,
    mergeWith(
      {},
      componentProps.lifeCycles,
      (v1: LifeCycleFn<Record<string, unknown>>, v2: LifeCycleFn<Record<string, unknown>>) => concat(v1, v2),
    ),
  );

  microApp.mountPromise
    .then(() => {
      if (componentProps.autoSetLoading) {
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

  return microApp;
}

export function updateMicroApp({
  name,
  microApp,
  microAppProps,
  setLoading,
}: {
  name?: string;
  microApp?: MicroAppType;
  microAppProps?: Record<string, unknown>;
  setLoading?: (loading: boolean) => void;
}) {
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
            ...microAppProps,
            setLoading(l: boolean) {
              setLoading?.(l);
            },
          };

          if (process.env.NODE_ENV === 'development') {
            const updatingTimestamp = microApp._updatingTimestamp!;
            if (Date.now() - updatingTimestamp < 200) {
              console.warn(
                `[@qiankunjs/ui-shared] It seems like microApp ${name} is updating too many times in a short time(200ms), you may need to do some optimization to avoid the unnecessary re-rendering.`,
              );
            }

            console.info(`[@qiankunjs/ui-shared}] MicroApp ${name} is updating with props: `, props);
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

export async function unmountMicroApp(microApp: MicroAppType) {
  await microApp.mountPromise.then(() => microApp.unmount());
}
