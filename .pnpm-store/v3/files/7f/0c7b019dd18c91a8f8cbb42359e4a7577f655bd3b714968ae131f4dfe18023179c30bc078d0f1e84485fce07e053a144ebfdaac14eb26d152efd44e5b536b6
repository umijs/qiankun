export declare type ImportFromSource = {
    from: string;
    type?: string;
} | string;
export declare type ImportCustomProperties = {
    customProperties?: Record<string, string>;
    'custom-properties'?: Record<string, string>;
};
export declare type ImportAsFunction = () => ImportFromSource | ImportCustomProperties;
export declare type ImportAsPromise = Promise<ImportFromSource | ImportCustomProperties>;
export declare type ImportAsFunctionPromise = () => Promise<ImportFromSource | ImportCustomProperties>;
export declare type ImportOptions = ImportFromSource | ImportCustomProperties | ImportAsFunction | ImportAsPromise | ImportAsFunctionPromise;
export declare type ExportJSONFunction = (customProperties?: Record<string, string>) => Record<string, string>;
export declare type ExportToSource = {
    to: string;
    type?: string;
    toJSON: ExportJSONFunction;
} | string;
export declare type ExportCustomProperties = {
    customProperties?: Record<string, string>;
    'custom-properties'?: Record<string, string>;
    toJSON: ExportJSONFunction;
};
export declare type ExportAsFunction = (ExportCustomProperties: any) => void;
export declare type ExportAsFunctionPromise = (ExportCustomProperties: any) => Promise<void>;
export declare type ExportOptions = ExportToSource | ExportCustomProperties | ExportAsFunction | ExportAsFunctionPromise;
