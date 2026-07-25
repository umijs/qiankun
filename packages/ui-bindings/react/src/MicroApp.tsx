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

/**
 * `Props` carries a string index signature so hosts can forward arbitrary props to the micro
 * app. React's `PropsWithoutRef` then `Omit`s `ref` from it, and omitting anything from a type
 * with an index signature collapses every named field into that signature — leaving callers
 * with no checking and no inference on `name`, `entry`, `loader`, … So the public type of the
 * component is spelled out here rather than inferred from `forwardRef`.
 */
export const MicroApp: React.ForwardRefExoticComponent<Props & React.RefAttributes<MicroAppType | undefined>> =
  forwardRef<MicroAppType | undefined, Props>((forwardedProps, componentRef) => {
    // the render function's props are collapsed by the same `PropsWithoutRef` mapped type
    const componentProps = forwardedProps as Props;
    const { name, autoSetLoading, autoCaptureError, wrapperClassName, className, loader, errorBoundary } =
      componentProps;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const containerRef = useRef<HTMLDivElement>(null);
    const microAppRef = useRef<MicroAppType | undefined>(undefined);
    /**
     * Mounts and unmounts of this component are serialized through one chain. An effect cleanup
     * can land while its mount is still in flight — StrictMode does exactly that on every mount in
     * development — and the unmount has to wait for that mount rather than find no app yet and skip
     * it, which would leave the instance mounted and its successor waiting on it forever.
     */
    const lifecycleRef = useRef<Promise<MicroAppType | undefined> | null>(null);

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
      const mounting = (lifecycleRef.current ?? Promise.resolve(undefined))
        .then((prevMicroApp) =>
          mountMicroApp({
            prevMicroApp,
            container: containerRef.current!,
            componentProps,
            setLoading,
            setError: setComponentError,
          }),
        )
        .then((app): MicroAppType | undefined => {
          microAppRef.current = app;
          return app;
        });

      lifecycleRef.current = mounting.catch(() => undefined);
      mounting.catch((e: Error) => {
        onError(e);
      });

      return () => {
        const unmounting = mounting.then(async (microApp) => {
          if (microApp) {
            // 微应用 unmount 是异步的，中间的流转状态不能确定，所有需要一个标志位来确保 unmount 开始之后不会再触发 update
            microApp._unmounting = true;
            await unmountMicroApp(microApp);
          }

          microAppRef.current = undefined;
          return undefined;
        });

        lifecycleRef.current = unmounting.catch(() => undefined);
        unmounting.catch((e: Error) => {
          onError(e);
        });
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

    // The container comes first inside the wrapper on purpose: qiankun keys its parcel cache and
    // its same-container serialization on the container's XPath, which counts same-tag siblings
    // *before* the element. A loader or error panel that renders conditionally would otherwise
    // shift that index between mounts and silently split one app into two cache entries. Slots
    // rendering after the container also paint above it without needing a z-index.
    return microAppLoader || microAppErrorBoundary ? (
      <div style={{ position: 'relative' }} className={microAppWrapperClassName}>
        <div ref={containerRef} className={microAppClassName} />
        {microAppLoader && microAppLoader(loading)}
        {microAppErrorBoundary && error && microAppErrorBoundary(error)}
      </div>
    ) : (
      <div ref={containerRef} className={microAppClassName} />
    );
  });
