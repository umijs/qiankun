import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { FactoryNodeClass } from '../../core/Tree/Factory.js';
import StackItemFactory from './StackItemFactory.js';
export declare type EnvProp = string | number | boolean;
export declare type EnvList = {
    [key: string]: EnvProp;
};
export declare type Prop = string | number | boolean | MmlNode | PropList;
export declare type PropList = {
    [key: string]: Prop;
};
export declare type CheckType = [(MmlNode | StackItem)[], boolean];
export interface NodeStack {
    First: MmlNode;
    Last: MmlNode;
    Pop(): MmlNode | void;
    Push(...nodes: MmlNode[]): void;
    Peek(n?: number): MmlNode[];
    Size(): number;
    Clear(): void;
    toMml(inferred?: boolean, forceRow?: boolean): MmlNode;
}
export declare abstract class MmlStack implements NodeStack {
    private _nodes;
    constructor(_nodes: MmlNode[]);
    protected get nodes(): MmlNode[];
    Push(...nodes: MmlNode[]): void;
    Pop(): MmlNode;
    get First(): MmlNode;
    set First(node: MmlNode);
    get Last(): MmlNode;
    set Last(node: MmlNode);
    Peek(n?: number): MmlNode[];
    Size(): number;
    Clear(): void;
    protected abstract get factory(): StackItemFactory;
    toMml(inferred?: boolean, forceRow?: boolean): MmlNode;
    create(kind: string, ...rest: any[]): MmlNode;
}
export interface StackItem extends NodeStack {
    kind: string;
    isClose: boolean;
    isOpen: boolean;
    isFinal: boolean;
    global: EnvList;
    env: EnvList;
    copyEnv: boolean;
    isKind(kind: string): boolean;
    getProperty(key: string): Prop;
    setProperty(key: string, value: Prop): StackItem;
    setProperties(def: PropList): StackItem;
    getName(): string;
    checkItem(item: StackItem): CheckType;
}
export interface StackItemClass extends FactoryNodeClass<StackItem> {
}
export declare abstract class BaseItem extends MmlStack implements StackItem {
    protected factory: StackItemFactory;
    protected static fail: CheckType;
    protected static success: CheckType;
    protected static errors: {
        [key: string]: string[];
    };
    global: EnvList;
    private _env;
    private _properties;
    constructor(factory: StackItemFactory, ...nodes: MmlNode[]);
    get kind(): string;
    get env(): EnvList;
    set env(value: EnvList);
    get copyEnv(): boolean;
    getProperty(key: string): Prop;
    setProperty(key: string, value: Prop): this;
    get isOpen(): boolean;
    get isClose(): boolean;
    get isFinal(): boolean;
    isKind(kind: string): boolean;
    checkItem(item: StackItem): CheckType;
    clearEnv(): void;
    setProperties(def: PropList): this;
    getName(): string;
    toString(): string;
    getErrors(kind: string): string[];
}
