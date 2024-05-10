/**
 * @author Kuitos
 * @since 2019-04-11
 */
import type { SandBox } from '../../interfaces';
import { SandBoxType } from '../../interfaces';
/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */
export default class LegacySandbox implements SandBox {
    /** 沙箱期间新增的全局变量 */
    private addedPropsMapInSandbox;
    /** 沙箱期间更新的全局变量 */
    private modifiedPropsOriginalValueMapInSandbox;
    /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
    private currentUpdatedPropsValueMap;
    name: string;
    proxy: WindowProxy;
    globalContext: typeof window;
    type: SandBoxType;
    sandboxRunning: boolean;
    latestSetProp: PropertyKey | null;
    private setWindowProp;
    active(): void;
    inactive(): void;
    constructor(name: string, globalContext?: Window & typeof globalThis);
    patchDocument(): void;
}
