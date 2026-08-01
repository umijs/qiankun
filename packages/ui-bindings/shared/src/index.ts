import { AppOrParcelStatus } from '@qiankunjs/single-spa';
import type { AppConfiguration, MicroApp as MicroAppTypeDefinition, LifeCycles } from 'qiankun';
import { loadMicroApp } from 'qiankun';
import { omit } from 'lodash';

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

/**
 * Everything the binding component consumes itself. None of it is meaningful to a micro app,
 * and leaking the render slots in particular would defeat the props diffing the components do
 * before calling `update` — an inline `loader` is a new function on every host render.
 */
const componentOwnedProps = [
  'name',
  'entry',
  'settings',
  'lifeCycles',
  'autoSetLoading',
  'autoCaptureError',
  'loader',
  'errorBoundary',
  'wrapperClassName',
  'className',
  // the Vue binding's channel for the micro app's own props: its contents are forwarded, the
  // wrapper object itself is not
  'appProps',
] as const;

export const omitSharedProps = (props: Partial<SharedProps>) => {
  return omit(props, componentOwnedProps);
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
    ...(componentProps.settings || {}),
  };

  // Handed over as-is: qiankun merges them over its own add-ons without mutating the source.
  // (Wrapping each hook with `concat(undefined, hook)` used to yield `[undefined, hook]`, which
  // qiankun then called as a hook — every app passing `lifeCycles` died on mount.)
  const microApp = loadMicroApp(
    {
      name: componentProps.name,
      entry: componentProps.entry,
      container,
      props: microAppProps,
    },
    configuration,
    componentProps.lifeCycles,
  );

  microApp.mountPromise
    .then(() => {
      // the app is up, so the loading state is over whichever way the host renders it —
      // gating this on `autoSetLoading` would leave a custom `loader` spinning forever
      setLoading?.(false);
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
  if (!microApp) return;

  // 首次更新以 mountPromise 为起点，确保更新发生在 mount 完成之后。这里只能是「补上起点」，不能
  // 「跳过本次更新」—— 否则宿主传入的第一次 props 变更会被直接吞掉。
  microApp._updatingPromise ??= microApp.mountPromise;
  microApp._updatingTimestamp ??= Date.now();

  // 确保 microApp.update 调用是跟组件状态变更顺序一致的，且后一个微应用更新必须等待前一个更新完成
  microApp._updatingPromise = microApp._updatingPromise.then(() => {
    const canUpdate = (app: MicroAppType) =>
      app.update && app.getStatus() === AppOrParcelStatus.MOUNTED && !app._unmounting;
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

        console.info(`[@qiankunjs/ui-shared] MicroApp ${name} is updating with props: `, props);
        microApp._updatingTimestamp = Date.now();
      }

      // 返回 microApp.update 形成链式调用
      return microApp.update?.(props);
    }

    return void 0;
  });
}

export async function unmountMicroApp(microApp: MicroAppType) {
  await microApp.mountPromise.then(() => microApp.unmount());
}
