import { AnyWrapper, Constructor } from '../Wrapper.js';
import { CommonMsubsup, MsubsupConstructor } from './msubsup.js';
import { BBox } from '../../../util/BBox.js';
export declare type ScriptData = {
    base: BBox;
    sub: BBox;
    sup: BBox;
    psub: BBox;
    psup: BBox;
    numPrescripts: number;
    numScripts: number;
};
export declare type ScriptDataName = keyof ScriptData;
export declare type ScriptLists = {
    base: BBox[];
    subList: BBox[];
    supList: BBox[];
    psubList: BBox[];
    psupList: BBox[];
};
export declare type ScriptListName = keyof ScriptLists;
export declare const NextScript: {
    [key: string]: ScriptListName;
};
export declare const ScriptNames: (keyof ScriptData)[];
export interface CommonMmultiscripts<W extends AnyWrapper> extends CommonMsubsup<W> {
    scriptData: ScriptData;
    firstPrescript: number;
    combinePrePost(pre: BBox, post: BBox): BBox;
    getScriptData(): void;
    getScriptBBoxLists(): ScriptLists;
    padLists(list1: BBox[], list2: BBox[]): void;
    combineBBoxLists(bbox1: BBox, bbox2: BBox, list1: BBox[], list2: BBox[]): void;
    getScaledWHD(bbox: BBox): void;
}
export declare type MmultiscriptsConstructor<W extends AnyWrapper> = Constructor<CommonMmultiscripts<W>>;
export declare function CommonMmultiscriptsMixin<W extends AnyWrapper, T extends MsubsupConstructor<W>>(Base: T): MmultiscriptsConstructor<W> & T;
