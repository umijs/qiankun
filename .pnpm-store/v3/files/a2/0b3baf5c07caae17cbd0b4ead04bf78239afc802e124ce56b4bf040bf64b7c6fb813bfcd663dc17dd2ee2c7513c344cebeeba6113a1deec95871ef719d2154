export interface PrioritizedListItem<DataClass> {
    priority: number;
    item: DataClass;
}
export declare class PrioritizedList<DataClass> {
    static DEFAULTPRIORITY: number;
    protected items: PrioritizedListItem<DataClass>[];
    constructor();
    [Symbol.iterator](): Iterator<PrioritizedListItem<DataClass>>;
    add(item: DataClass, priority?: number): DataClass;
    remove(item: DataClass): void;
}
