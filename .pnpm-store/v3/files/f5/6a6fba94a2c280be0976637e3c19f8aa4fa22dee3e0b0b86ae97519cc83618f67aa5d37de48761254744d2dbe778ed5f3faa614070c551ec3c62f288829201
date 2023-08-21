declare type MetreEvent = {
    name: string;
    timestamp?: number;
    payload: any;
};
interface IStorage {
    save(e: MetreEvent): Promise<void>;
}
export interface IMetry {
    record(e: MetreEvent): void;
    recordAsync(e: MetreEvent): Promise<boolean>;
    flush(): Promise<void>;
}
export declare class Telemetry implements IMetry {
    private queuedEvents;
    private storage;
    constructor();
    prefixWith(prefix: string): IMetry;
    useStorage(s: IStorage): void;
    record(e: MetreEvent): void;
    recordAsync(e: MetreEvent): Promise<boolean>;
    flush(): Promise<void>;
    private scheduleFlush;
    private afterFlush;
    private unFinishedEvents;
    private addTimeStamp;
}
declare class NoopStorage implements IStorage {
    save(_e: MetreEvent): Promise<void>;
}
export declare const noopStorage: NoopStorage;
export {};
