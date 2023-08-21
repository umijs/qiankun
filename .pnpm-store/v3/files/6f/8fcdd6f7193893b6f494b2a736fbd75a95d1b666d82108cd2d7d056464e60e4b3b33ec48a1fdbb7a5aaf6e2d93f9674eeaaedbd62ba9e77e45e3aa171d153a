import { KeyCode } from '../common/event_util';
import { AxisMap } from '../rule_engine/dynamic_cstr';
import { Focus } from './focus';
import { RebuildStree } from './rebuild_stree';
export interface Walker {
    modifier: boolean;
    isActive(): boolean;
    activate(): void;
    deactivate(): void;
    speech(): string;
    getXml(): Element;
    getRebuilt(): RebuildStree;
    getFocus(opt_update?: boolean): Focus;
    setFocus(focus: Focus): void;
    getDepth(): number;
    move(key: KeyCode): boolean | null;
    update(options: AxisMap): void;
    refocus(): void;
}
export declare enum WalkerMoves {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    REPEAT = "repeat",
    DEPTH = "depth",
    ENTER = "enter",
    EXPAND = "expand",
    HOME = "home",
    SUMMARY = "summary",
    DETAIL = "detail",
    ROW = "row",
    CELL = "cell"
}
export declare class WalkerState {
    private static STATE;
    static resetState(id: string): void;
    static setState(id: string, value: string): void;
    static getState(id: string): string;
}
