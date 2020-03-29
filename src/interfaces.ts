/**
 * @author kuitos
 * @since 2019-05-16
 */
import { ImportEntryOpts } from 'import-html-entry';

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

export type RegistrableApp<T extends object = {}> = {
  name: string; // app name
  entry: Entry; // app entry
  render: render;
  activeRule: (location: Location) => boolean;
  props?: T; // props pass through to app
};

export type Prefetch =
  | boolean
  | 'all'
  | string[]
  | ((apps: RegistrableApp[]) => { criticalAppNames: string[]; minorAppsName: string[] });

export type StartOpts = {
  prefetch?: Prefetch;
  jsSandbox?: boolean;
  singular?: boolean | ((app: RegistrableApp<any>) => Promise<boolean>);
} & ImportEntryOpts;

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
