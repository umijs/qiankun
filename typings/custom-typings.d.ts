type Splat<T> = {
  [p in keyof T]: Array<T[p]>
};

type LifeCycles = {
  bootstrap: () => Promise<any>;
  mount: () => Promise<any>;
  unmount: () => Promise<any>;
};

declare module 'single-spa' {

  export function start(): void;

  export function registerApplication(
    name: string,
    applicationOrLoadingFn: () => Promise<Splat<LifeCycles>>,
    activityFn: (location: Location, type?: string) => boolean,
    customProps?: object,
  ): void;

  export function getMountedApps(): string[];

  export function navigateToUrl(url: string): void;
}

declare module '*.less' {
  const content: any;
  export default content;
}

declare namespace AntdCloudNav {
  export function config(configuration: any): typeof AntdCloudNav;

  export function start(selector: string): typeof AntdCloudNav;

  export function getProductUrlByCode(productCode: string): string;

  export function getNavData(): any;

  export function getDeployMode<T = string>(authurl?: string): Promise<T>;

  export function redirectToLogin(): void;

  export function redirectTo403(): void;
}

declare namespace Tracert {
  export function start(config: any): void;
}

// tslint:disable-next-line
interface Window {
  readonly __ONE_CONSOLE_DEV__?: {
    readonly antdCloudNav?: any;
    readonly sideMenuMock?: any;
  };
}
