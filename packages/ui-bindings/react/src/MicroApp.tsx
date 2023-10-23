import { concat, isEqual, mergeWith, noop } from 'lodash';
import { loadMicroApp } from 'qiankun';
import type { AppConfiguration, MicroApp as MicroAppTypeDefinition, LifeCycleFn, LifeCycles } from 'qiankun';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Ref } from 'react';
import ErrorBoundary from './ErrorBoundary';
import MicroAppLoader from './MicroAppLoader';

type MicroAppType = {
  _unmounting?: boolean;
  _updatingPromise?: Promise<null>;
  _updatingTimestamp?: number;
} & MicroAppTypeDefinition;

export type Props = {
  name: string;
  entry: string;
  settings?: AppConfiguration;
  lifeCycles?: LifeCycles<Record<string, unknown>>;
  loader?: (loading: boolean) => React.ReactNode;
  errorBoundary?: (error: Error) => React.ReactNode;
  autoSetLoading?: boolean;
  autoCaptureError?: boolean;
  // 仅开启 loader 时需要
  wrapperClassName?: string;
  className?: string;
} & Record<string, unknown>;

async function unmountMicroApp(microApp: MicroAppType) {
  await microApp.mountPromise.then(() => microApp.unmount());
}

function useDeepCompare<T>(value: T): T {
  const ref = useRef<T>(value);
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export const MicroApp = forwardRef((componentProps: Props, componentRef: Ref<MicroAppType | undefined>) => {
  const {
    name,
    entry,
    settings = {},
    loader,
    errorBoundary,
    lifeCycles,
    wrapperClassName,
    className,
    ...propsFromParams
  } = componentProps;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  // 未配置自定义 errorBoundary 且开启了 autoCaptureError 场景下，使用插件默认的 errorBoundary，否则使用自定义 errorBoundary
  const microAppErrorBoundary =
    errorBoundary || (propsFromParams.autoCaptureError ? (e) => <ErrorBoundary error={e} /> : null);

  // 配置了 errorBoundary 才改 error 状态，否则直接往上抛异常
  const setComponentError = (error: Error | undefined) => {
    if (microAppErrorBoundary) {
      setError(error);
      // error log 出来，不要吞
      if (error) {
        console.error(error);
      }
    } else if (error) {
      throw error;
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const microAppRef = useRef<MicroAppType>();

  useImperativeHandle(componentRef, () => microAppRef.current);

  useEffect(() => {
    setComponentError(undefined);
    setLoading(true);

    const configuration = {
      globalContext: window,
      ...settings,
    };

    microAppRef.current = loadMicroApp(
      {
        name,
        entry,
        container: containerRef.current!,
        props: propsFromParams,
      },
      configuration,
      mergeWith({}, lifeCycles, (v1: LifeCycleFn<Record<string, unknown>>, v2: LifeCycleFn<Record<string, unknown>>) =>
        concat(v1, v2),
      ),
    );

    microAppRef.current.mountPromise
      .then(() => {
        if (propsFromParams.autoSetLoading) {
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        setComponentError(e);
        setLoading(false);
      });

    (['loadPromise', 'bootstrapPromise'] as const).forEach((key) => {
      const promise = microAppRef.current![key];
      promise.catch((e: Error) => {
        setComponentError(e);
        setLoading(false);
      });
    });

    return () => {
      const microApp = microAppRef.current;
      if (microApp) {
        // 微应用 unmount 是异步的，中间的流转状态不能确定，所有需要一个标志位来确保 unmount 开始之后不会再触发 update
        microApp._unmounting = true;
        unmountMicroApp(microApp).catch((e: Error) => {
          setComponentError(e);
          setLoading(false);
        });
      }
    };
  }, [name]);

  useEffect(() => {
    const microApp = microAppRef.current;
    if (microApp) {
      if (!microApp._updatingPromise) {
        // 初始化 updatingPromise 为 microApp.mountPromise，从而确保后续更新是在应用 mount 完成之后
        microApp._updatingPromise = microApp.mountPromise;
        microApp._updatingTimestamp = Date.now();
      } else {
        // 确保 microApp.update 调用是跟组件状态变更顺序一致的，且后一个微应用更新必须等待前一个更新完成
        microApp._updatingPromise = microApp._updatingPromise.then(() => {
          const canUpdate = (microApp: MicroAppType) =>
            microApp.update && microApp.getStatus() === 'MOUNTED' && !microApp._unmounting;
          if (canUpdate(microApp)) {
            const props = {
              ...propsFromParams,
              setLoading,
            };

            if (process.env.NODE_ENV === 'development') {
              const updatingTimestamp = microApp._updatingTimestamp!;
              if (Date.now() - updatingTimestamp < 200) {
                console.warn(
                  `[@qiankunjs/react] It seems like microApp ${name} is updating too many times in a short time(200ms), you may need to do some optimization to avoid the unnecessary re-rendering.`,
                );
              }

              console.info(`[@qiankunjs/react] MicroApp ${name} is updating with props: `, props);
              microApp._updatingTimestamp = Date.now();
            }

            // 返回 microApp.update 形成链式调用
            return microApp.update?.(props);
          }

          return void 0;
        });
      }
    }

    return noop;
  }, [useDeepCompare(propsFromParams)]);

  // 未配置自定义 loader 且开启了 autoSetLoading 场景下，使用插件默认的 loader，否则使用自定义 loader
  const microAppLoader =
    loader || (propsFromParams.autoSetLoading ? (loading) => <MicroAppLoader loading={loading} /> : null);

  const microAppWrapperClassName = wrapperClassName
    ? `${wrapperClassName} qiankun-micro-app-wrapper`
    : 'qiankun-micro-app-wrapper';
  const microAppClassName = className ? `${className} qiankun-micro-app-container` : 'qiankun-micro-app-container';

  return microAppLoader || microAppErrorBoundary ? (
    <div style={{ position: 'relative' }} className={microAppWrapperClassName}>
      {microAppLoader && microAppLoader(loading)}
      {microAppErrorBoundary && error && microAppErrorBoundary(error)}
      <div ref={containerRef} className={microAppClassName} />
    </div>
  ) : (
    <div ref={containerRef} className={microAppClassName} />
  );
});
