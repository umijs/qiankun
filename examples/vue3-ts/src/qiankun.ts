/**
 * @author kuitos
 * @since 2019-05-16
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
    __QIANKUN_DEVELOPMENT__?: boolean;
    Zone?: CallableFunction;
  }
}

export type ObjectType = Record<string, any>;

export type Entry =
  | string
  | {
      scripts?: string[];
      styles?: string[];
      html?: string;
    };

export type HTMLContentRender = (props: { appContent: string; loading: boolean }) => any;

export type AppMetadata = {
  // app name
  name: string;
  // app entry
  entry: Entry;
};
export type OnGlobalStateChangeCallback = (state: Record<string, any>, prevState: Record<string, any>) => void;

export type MicroAppStateActions = {
  onGlobalStateChange: (callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void;
  setGlobalState: (state: Record<string, any>) => boolean;
  offGlobalStateChange: () => boolean;
};

// just for manual loaded apps, in single-spa it called parcel
export type LoadableApp<T extends ObjectType> = MicroAppStateActions & AppMetadata & {
  /* props pass through to app */ props?: T;
} & (
    | {
        // legacy mode, the render function all handled by user
        render: HTMLContentRender;
      }
    | {
        // where the app mount to, mutual exclusive with the legacy custom render function
        container: string | HTMLElement;
      }
  );
