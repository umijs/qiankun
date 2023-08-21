export default class FileCache {
    cache: Record<string, {
        filePath: string;
        updatedTime: number;
        value: any;
    }>;
    add(filePath: string, value: any, key?: string): void;
    get(key: string): any;
}
