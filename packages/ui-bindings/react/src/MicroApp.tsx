import { isEqual, noop } from 'lodash';
import {
  type SharedProps,
  type MicroAppType,
  type SharedSlots,
  unmountMicroApp,
  mountMicroApp,
  updateMicroApp,
  omitSharedProps,
} from '@qiankunjs/ui-shared';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import MicroAppLoader from './MicroAppLoader';

export type Props = SharedProps & SharedSlots<React.ReactNode> & Record<string, unknown>;

function useDeepCompare<T>(value: T): T {
  const ref = useRef<T>(value);
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export const MicroApp = forwardRef<MicroAppType | undefined, Props>((forwardedProps, componentRef) => {
  // React's PropsWithoutRef mapped type drops named fields when Props also has a string index signature.
  const componentProps = forwardedProps as Props;
  const { name, autoSetLoading, autoCaptureError, wrapperClassName, className, loader, errorBoundary } = componentProps;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const containerRef = useRef<HTMLDivElement>(null);
  const microAppRef = useRef<MicroAppType>();

  // 未配置自定义 errorBoundary 且开启了 autoCaptureError 场景下，使用插件默认的 errorBoundary，否则使用自定义 errorBoundary
  const microAppErrorBoundary = errorBoundary || (autoCaptureError ? (e) => <ErrorBoundary error={e} /> : null);

  // 配置了 errorBoundary 才改 error 状态，否则直接往上抛异常
  const setComponentError = (e: Error | undefined) => {
    if (microAppErrorBoundary) {
      setError(e);
      // error log 出来，不要吞
      if (e) {
        console.error(e);
      }
    } else if (e) {
      throw e;
    }
  };

  const onError = (e: Error) => {
    setComponentError(e);
    setLoading(false);
  };

  useImperativeHandle(componentRef, () => microAppRef.current);

  useEffect(() => {
    mountMicroApp({
      prevMicroApp: microAppRef.current,
      container: containerRef.current!,
      componentProps,
      setLoading,
      setError: setComponentError,
    })
      .then((app) => {
        microAppRef.current = app;
      })
      .catch((e: Error) => {
        onError(e);
      });

    return () => {
      const microApp = microAppRef.current;
      if (microApp && microApp.getStatus() === 'MOUNTED') {
        // 微应用 unmount 是异步的，中间的流转状态不能确定，所有需要一个标志位来确保 unmount 开始之后不会再触发 update
        microApp._unmounting = true;
        unmountMicroApp(microApp).catch((e: Error) => {
          onError(e);
        });
      }
    };
    // `name` defines the mounted app identity; changing other props must update the existing app instead of remounting it.
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [name]);

  const microAppProps = useDeepCompare(omitSharedProps(componentProps));
  useEffect(() => {
    updateMicroApp({
      name,
      microApp: microAppRef.current,
      microAppProps,
      setLoading,
    });

    return noop;
    // A name-only change is handled by the mount effect above; updating the previous app here would race its unmount.
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [microAppProps]);

  // 未配置自定义 loader 且开启了 autoSetLoading 场景下，使用插件默认的 loader，否则使用自定义 loader
  const microAppLoader =
    loader || (autoSetLoading ? (loadingStatus) => <MicroAppLoader loading={loadingStatus} /> : null);

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
