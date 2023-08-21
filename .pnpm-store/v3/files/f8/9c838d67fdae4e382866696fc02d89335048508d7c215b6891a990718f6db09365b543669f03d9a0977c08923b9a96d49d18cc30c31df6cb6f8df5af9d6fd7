import { VariableItem } from './variable_item.js';
import { VariablePool } from './variable_pool.js';
import { ParserFactory } from './parser_factory.js';
export declare class Variable<T> {
    private _name;
    private getter;
    private setter;
    private items;
    static fromJson(_factory: ParserFactory, { name: name, getter: getter, setter: setter }: {
        name: string;
        getter: () => string | boolean;
        setter: (x: (string | boolean)) => void;
    }, pool: VariablePool<string | boolean>): void;
    constructor(_name: string, getter: (node?: HTMLElement) => T, setter: (x: T, node?: HTMLElement) => void);
    get name(): string;
    getValue(node?: HTMLElement): T;
    setValue(value: T, node?: HTMLElement): void;
    register(item: VariableItem): void;
    unregister(item: VariableItem): void;
    update(): void;
    registerCallback(func: Function): void;
    unregisterCallback(func: Function): void;
    toJson(): {
        type: string;
        name: string;
        getter: string;
        setter: string;
    };
}
