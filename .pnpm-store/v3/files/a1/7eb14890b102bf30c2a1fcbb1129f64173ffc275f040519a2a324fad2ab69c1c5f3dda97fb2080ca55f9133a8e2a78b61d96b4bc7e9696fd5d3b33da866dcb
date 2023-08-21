import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { StackItem, EnvList } from './StackItem.js';
import StackItemFactory from './StackItemFactory.js';
export default class Stack {
    private _factory;
    private _env;
    global: EnvList;
    private stack;
    constructor(_factory: StackItemFactory, _env: EnvList, inner: boolean);
    set env(env: EnvList);
    get env(): EnvList;
    Push(...args: (StackItem | MmlNode)[]): void;
    Pop(): StackItem;
    Top(n?: number): StackItem;
    Prev(noPop?: boolean): MmlNode | void;
    toString(): string;
}
