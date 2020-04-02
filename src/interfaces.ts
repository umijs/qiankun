/**
 * @author kuitos
 * @since 2019-05-16
 */
import { ImportEntryOpts } from 'import-html-entry';
import { RegisterApplicationConfig } from 'single-spa';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  }
}

export type render = (props: { appContent: string; loading: boolean }) => any;
export type Entry =
  | string
  | {
      scripts?: string[];
      styles?: string[];
      html?: string;
    };

// just for manual loaded apps, in single-spa it called parcel
export type LoadableApp<T extends object = {}> = {
  name: string; // app name
  entry: Entry; // app entry
  render: render;
  props?: T; // props pass through to app
};

// for the route-based apps
export type RegistrableApp<T extends object = {}> = LoadableApp<T> & {
  activeRule: RegisterApplicationConfig['activeWhen'];
};

export type Prefetch =
  | boolean
  | 'all'
  | string[]
  | ((apps: RegistrableApp[]) => { criticalAppNames: string[]; minorAppsName: string[] });

type SingleSpaStartOpts = { urlRerouteOnly?: boolean };
type QiankunSpecialOpts = {
  prefetch?: Prefetch;
  jsSandbox?: boolean;
  /*
    with singular mode, any app will wait to load until other apps are unmouting
    it is useful for the scenario that only one sub app shown at one time
  */
  singular?: boolean | ((app: LoadableApp<any>) => Promise<boolean>);
};
export type Configuration = QiankunSpecialOpts & ImportEntryOpts & SingleSpaStartOpts;

export type Lifecycle<T extends object> = (app: LoadableApp<T>) => Promise<any>;

export type LifeCycles<T extends object> = {
  beforeLoad?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app load
  beforeMount?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app mount
  afterMount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app mount
  beforeUnmount?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app unmount
  afterUnmount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app unmount
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
