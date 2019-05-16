/**
 * @author kuitos
 * @since 2019-05-16
 */

export type RenderFunction = (props?: { appContent: string, loading: boolean }) => any;
export type ActiveRule = (app: RegistrableApp) => boolean;
export type RegistrableApp = {
  name: string; // 应用名(ID)，也可当做应用的产品码来用
  entry: Entry;  // 应用入口
  routerPrefix: string; // 应用路由前缀
  props?: object;
};

export type Entry = string | {
  scripts: string[];
  styles: string[];
};

export type StartOpts = {
  prefetch?: boolean;
  jsSandbox?: boolean;
};
