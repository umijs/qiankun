/**
 * @author Hydrogen
 * @since 2020-3-8
 */
import type { SandBox } from '../interfaces';
import { SandBoxType } from '../interfaces';
/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */
export default class SnapshotSandbox implements SandBox {
    proxy: WindowProxy;
    name: string;
    type: SandBoxType;
    sandboxRunning: boolean;
    private windowSnapshot;
    private modifyPropsMap;
    private deletePropsSet;
    constructor(name: string);
    active(): void;
    inactive(): void;
    patchDocument(): void;
}
