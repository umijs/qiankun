import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { MathItem } from '../../core/MathItem.js';
import { EnvList } from './StackItem.js';
import ParseOptions from './ParseOptions.js';
import { OptionList } from '../../util/Options.js';
export declare class Label {
    tag: string;
    id: string;
    constructor(tag?: string, id?: string);
}
export declare class TagInfo {
    readonly env: string;
    readonly taggable: boolean;
    readonly defaultTags: boolean;
    tag: string;
    tagId: string;
    tagFormat: string;
    noTag: boolean;
    labelId: string;
    constructor(env?: string, taggable?: boolean, defaultTags?: boolean, tag?: string, tagId?: string, tagFormat?: string, noTag?: boolean, labelId?: string);
}
export interface Tags {
    configuration: ParseOptions;
    ids: {
        [key: string]: boolean;
    };
    allIds: {
        [key: string]: boolean;
    };
    labels: {
        [key: string]: Label;
    };
    allLabels: {
        [key: string]: Label;
    };
    label: string;
    redo: boolean;
    refUpdate: boolean;
    env: string;
    currentTag: TagInfo;
    formatTag(tag: string): string;
    formatUrl(id: string, base: string): string;
    autoTag(): void;
    getTag(): MmlNode | void;
    clearTag(): void;
    resetTag(): void;
    reset(offset?: number): void;
    startEquation(math: MathItem<any, any, any>): void;
    finishEquation(math: MathItem<any, any, any>): void;
    finalize(node: MmlNode, env: EnvList): MmlNode;
    start(env: string, taggable: boolean, defaultTags: boolean): void;
    end(): void;
    tag(tag: string, noFormat: boolean): void;
    notag(): void;
    enTag(node: MmlNode, tag: MmlNode): MmlNode;
}
export declare class AbstractTags implements Tags {
    protected counter: number;
    protected allCounter: number;
    configuration: ParseOptions;
    ids: {
        [key: string]: boolean;
    };
    allIds: {
        [key: string]: boolean;
    };
    labels: {
        [key: string]: Label;
    };
    allLabels: {
        [key: string]: Label;
    };
    redo: boolean;
    refUpdate: boolean;
    currentTag: TagInfo;
    protected history: TagInfo[];
    private stack;
    start(env: string, taggable: boolean, defaultTags: boolean): void;
    get env(): string;
    end(): void;
    tag(tag: string, noFormat: boolean): void;
    notag(): void;
    protected get noTag(): boolean;
    set label(label: string);
    get label(): string;
    formatUrl(id: string, base: string): string;
    formatTag(tag: string): string;
    protected formatId(id: string): string;
    protected formatNumber(n: number): string;
    autoTag(): void;
    clearTag(): void;
    getTag(force?: boolean): MmlNode;
    resetTag(): void;
    reset(offset?: number): void;
    startEquation(math: MathItem<any, any, any>): void;
    finishEquation(math: MathItem<any, any, any>): void;
    finalize(node: MmlNode, env: EnvList): MmlNode;
    enTag: (node: MmlNode, tag: MmlNode) => MmlNode;
    private makeId;
    private makeTag;
}
export declare class NoTags extends AbstractTags {
    autoTag(): void;
    getTag(): MmlNode;
}
export declare class AllTags extends AbstractTags {
    finalize(node: MmlNode, env: EnvList): MmlNode;
}
export interface TagsClass {
    new (): Tags;
}
export declare namespace TagsFactory {
    let OPTIONS: OptionList;
    let add: (name: string, constr: TagsClass) => void;
    let addTags: (tags: {
        [name: string]: TagsClass;
    }) => void;
    let create: (name: string) => Tags;
    let setDefault: (name: string) => void;
    let getDefault: () => Tags;
}
