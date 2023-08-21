export declare const END: unique symbol;
export declare type SortFn<DataClass> = (a: DataClass, b: DataClass) => boolean;
export declare class ListItem<DataClass> {
    data: DataClass | symbol;
    next: ListItem<DataClass>;
    prev: ListItem<DataClass>;
    constructor(data?: any);
}
export declare class LinkedList<DataClass> {
    protected list: ListItem<DataClass>;
    constructor(...args: DataClass[]);
    isBefore(a: DataClass, b: DataClass): boolean;
    push(...args: DataClass[]): LinkedList<DataClass>;
    pop(): DataClass;
    unshift(...args: DataClass[]): LinkedList<DataClass>;
    shift(): DataClass;
    remove(...items: DataClass[]): void;
    clear(): LinkedList<DataClass>;
    [Symbol.iterator](): IterableIterator<DataClass>;
    reversed(): IterableIterator<DataClass>;
    insert(data: DataClass, isBefore?: SortFn<DataClass>): this;
    sort(isBefore?: SortFn<DataClass>): LinkedList<DataClass>;
    merge(list: LinkedList<DataClass>, isBefore?: SortFn<DataClass>): LinkedList<DataClass>;
}
