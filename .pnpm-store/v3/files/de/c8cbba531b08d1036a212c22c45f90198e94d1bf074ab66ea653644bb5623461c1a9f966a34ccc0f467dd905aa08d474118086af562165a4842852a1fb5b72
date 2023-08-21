import { AnyWrapper, Constructor } from '../Wrapper.js';
import { CommonScriptbase, ScriptbaseConstructor } from './scriptbase.js';
import { BBox } from '../../../util/BBox.js';
export interface CommonMsub<W extends AnyWrapper> extends CommonScriptbase<W> {
}
export declare type MsubConstructor<W extends AnyWrapper> = Constructor<CommonMsub<W>>;
export declare function CommonMsubMixin<W extends AnyWrapper, T extends ScriptbaseConstructor<W>>(Base: T): MsubConstructor<W> & T;
export interface CommonMsup<W extends AnyWrapper> extends CommonScriptbase<W> {
}
export declare type MsupConstructor<W extends AnyWrapper> = Constructor<CommonMsup<W>>;
export declare function CommonMsupMixin<W extends AnyWrapper, T extends ScriptbaseConstructor<W>>(Base: T): MsupConstructor<W> & T;
export interface CommonMsubsup<W extends AnyWrapper> extends CommonScriptbase<W> {
    UVQ: number[];
    readonly subChild: W;
    readonly supChild: W;
    getUVQ(subbox?: BBox, supbox?: BBox): number[];
}
export declare type MsubsupConstructor<W extends AnyWrapper> = Constructor<CommonMsubsup<W>>;
export declare function CommonMsubsupMixin<W extends AnyWrapper, T extends ScriptbaseConstructor<W>>(Base: T): MsubsupConstructor<W> & T;
