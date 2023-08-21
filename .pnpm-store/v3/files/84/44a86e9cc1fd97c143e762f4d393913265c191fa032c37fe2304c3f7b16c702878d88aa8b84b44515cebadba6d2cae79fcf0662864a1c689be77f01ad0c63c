export default class FileSystemCache {
    basePath: string;
    ns?: string;
    extension?: string;
    basePathExists?: boolean;
    constructor(options?: {
        basePath?: string;
        ns?: string;
        extension?: string;
    });
    path(key: string): string;
    fileExists(key: string): any;
    ensureBasePath(): Promise<void>;
    get(key: string, defaultValue: any): Promise<unknown>;
    getSync(key: string, defaultValue: any): any;
    set(key: string, value: any): Promise<{
        path: string;
    }>;
    setSync(key: string, value: any): this;
    remove(key: string): any;
    clear(): Promise<void>;
    save(items: {
        key: string;
        value: any;
    }[]): Promise<unknown>;
    load(): Promise<unknown>;
}
