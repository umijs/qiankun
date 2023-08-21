export declare type FileSystemCacheOptions = {
    basePath?: string;
    ns?: any;
    extension?: string;
};
export declare class FileSystemCache {
    basePath: string;
    ns?: any;
    extension?: string;
    basePathExists?: boolean;
    constructor(options?: FileSystemCacheOptions);
    path(key: string): string;
    fileExists(key: string): Promise<boolean>;
    ensureBasePath(): Promise<void>;
    get(key: string, defaultValue?: any): Promise<any>;
    getSync(key: string, defaultValue?: any): any;
    set(key: string, value: any): Promise<{
        path: string;
    }>;
    setSync(key: string, value: any): this;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
    save(input: ({
        key: string;
        value: any;
    } | null | undefined)[]): Promise<{
        paths: string[];
    }>;
    load(): Promise<{
        files: {
            path: string;
            value: any;
        }[];
    }>;
}
