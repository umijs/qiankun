/**
 * @author Kuitos
 * @since 2019-04-11
 */
import type { SandBox } from '../interfaces';
export { getCurrentRunningApp } from './common';
export { css } from './patchers';
/**
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始前生成好的的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 * @param elementGetter
 * @param scopedCSS
 * @param useLooseSandbox
 * @param excludeAssetFilter
 * @param globalContext
 * @param speedySandBox
 */
export declare function createSandboxContainer(appName: string, elementGetter: () => HTMLElement | ShadowRoot, scopedCSS: boolean, useLooseSandbox?: boolean, excludeAssetFilter?: (url: string) => boolean, globalContext?: typeof window, speedySandBox?: boolean): {
    instance: SandBox;
    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    mount(): Promise<void>;
    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    unmount(): Promise<void>;
};
