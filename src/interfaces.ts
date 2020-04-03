/**
 * @author kuitos
 * @since 2019-05-16
 */
import { ImportEntryOpts } from 'import-html-entry';
import { RegisterApplicationConfig, StartOpts } from 'single-spa';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  }
}

export type Entry =
  | string
  | {
      scripts?: string[];
      styles?: string[];
      html?: string;
    };

export type HTMLContentRender = (props: { appContent: string; loading: boolean }) => any;
export type ElementRender = (props: { element: HTMLElement | null; loading: boolean }) => any;

// just for manual loaded apps, in single-spa it called parcel
export type LoadableApp<T extends object = {}> = {
  // app name
  name: string;
  // app entry
  entry: Entry;
  render: ElementRender | HTMLContentRender;
  // if legacyRender enabled, the render will be convert to HTMLContentRender automatically
  legacyRender?: boolean;
  // props pass through to app
  props?: T;
};

// for the route-based apps
export type RegistrableApp<T extends object = {}> = {
  activeRule: RegisterApplicationConfig['activeWhen'];
} & LoadableApp<T>;

export type Prefetch =
  | boolean
  | 'all'
  | string[]
  | ((apps: RegistrableApp[]) => { criticalAppNames: string[]; minorAppsName: string[] });

type QiankunSpecialOpts = {
  prefetch?: Prefetch;
  jsSandbox?: boolean;
  cssIsolation?: boolean;
  /*
    with singular mode, any app will wait to load until other apps are unmouting
    it is useful for the scenario that only one sub app shown at one time
  */
  singular?: boolean | ((app: LoadableApp<any>) => Promise<boolean>);
};
export type FrameworkConfiguration = QiankunSpecialOpts & ImportEntryOpts & StartOpts;

export type LifeCycleFn<T extends object> = (app: LoadableApp<T>) => Promise<any>;
export type FrameworkLifeCycles<T extends object> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app load
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app mount
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function after app mount
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app unmount
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function after app unmount
};

export type Rebuilder = () => void;
export type Freer = () => Rebuilder;

export interface SandBox {
  /** 沙箱的名字 */
  name: string;
  /** 沙箱导出的代理实体 */
  proxy: WindowProxy;
  /** 沙箱是否在运行中 */
  sandboxRunning: boolean;
  /** 启动沙箱 */
  active(): void;
  /** 关闭沙箱 */
  inactive(): void;
}
