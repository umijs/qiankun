import { AnyWrapper, Constructor } from '../Wrapper.js';
import { CommonScriptbase, ScriptbaseConstructor } from './scriptbase.js';
export interface CommonMunder<W extends AnyWrapper> extends CommonScriptbase<W> {
}
export declare type MunderConstructor<W extends AnyWrapper> = Constructor<CommonMunder<W>>;
export declare function CommonMunderMixin<W extends AnyWrapper, T extends ScriptbaseConstructor<W>>(Base: T): MunderConstructor<W> & T;
export interface CommonMover<W extends AnyWrapper> extends CommonScriptbase<W> {
}
export declare type MoverConstructor<W extends AnyWrapper> = Constructor<CommonMover<W>>;
export declare function CommonMoverMixin<W extends AnyWrapper, T extends ScriptbaseConstructor<W>>(Base: T): MoverConstructor<W> & T;
export interface CommonMunderover<W extends AnyWrapper> extends CommonScriptbase<W> {
    readonly underChild: W;
    readonly overChild: W;
}
export declare type MunderoverConstructor<W extends AnyWrapper> = Constructor<CommonMunderover<W>>;
export declare function CommonMunderoverMixin<W extends AnyWrapper, T extends ScriptbaseConstructor<W>>(Base: T): MunderoverConstructor<W> & T;
