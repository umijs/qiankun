import { isEqual, noop } from 'lodash';
import { type SharedProps, type MicroAppType, type SharedSlots, unmountMicroApp, mountMicroApp, updateMicroApp } from '@qiankunjs/ui-shared';
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

export const MicroApp = forwardRef((componentProps: Props, componentRef: Ref<MicroAppType | undefined>) => {
  const {
    name,
    loader,
    errorBoundary,
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

  const containerRef = useRef<HTMLDivElement>(null);
  const microAppRef = useRef<MicroAppType>();

  useImperativeHandle(componentRef, () => microAppRef.current);

  useEffect(() => {
    mountMicroApp({
      props: componentProps,
      container: containerRef.current!,
      propsFromParams,
      setApp(app) {
        microAppRef.current = app;
      },
      setLoading: (loading) => {
        setLoading(loading);
      },
      setError: setComponentError,
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
    updateMicroApp({
      name: name,
      propsFromParams,
      getApp() {
        return microAppRef.current;
      },
      setLoading: (loading) => {
        setLoading(loading);
      },
      source: 'react',
    })

    return noop;
  }, [useDeepCompare(propsFromParams)]);

  // 未配置自定义 loader 且开启了 autoSetLoading 场景下，使用插件默认的 loader，否则使用自定义 loader
  const microAppLoader =
    loader || (propsFromParams.autoSetLoading ? (loadingStatus) => <MicroAppLoader loading={loadingStatus} /> : null);

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
