interface ResolveOptions {
    url?: string | URL | (string | URL)[];
    extensions?: string[];
    conditions?: string[];
}
declare function resolveSync(id: string, options?: ResolveOptions): string;
declare function resolve(id: string, options?: ResolveOptions): Promise<string>;
declare function resolvePathSync(id: string, options?: ResolveOptions): string;
declare function resolvePath(id: string, options?: ResolveOptions): Promise<string>;
declare function createResolve(defaults?: ResolveOptions): (id: string, url?: ResolveOptions["url"]) => Promise<string>;
declare function parseNodeModulePath(path: string): {
    dir?: undefined;
    name?: undefined;
    subpath?: undefined;
} | {
    dir: string;
    name: string;
    subpath: string;
};
/** Reverse engineer a subpath export if possible */
declare function lookupNodeModuleSubpath(path: string): Promise<string | undefined>;

interface ESMImport {
    type: "static" | "dynamic";
    code: string;
    start: number;
    end: number;
}
interface StaticImport extends ESMImport {
    type: "static";
    imports: string;
    specifier: string;
}
interface ParsedStaticImport extends StaticImport {
    defaultImport?: string;
    namespacedImport?: string;
    namedImports?: {
        [name: string]: string;
    };
}
interface DynamicImport extends ESMImport {
    type: "dynamic";
    expression: string;
}
interface TypeImport extends Omit<ESMImport, "type"> {
    type: "type";
    imports: string;
    specifier: string;
}
interface ESMExport {
    _type?: "declaration" | "named" | "default" | "star";
    type: "declaration" | "named" | "default" | "star";
    code: string;
    start: number;
    end: number;
    name?: string;
    names: string[];
    specifier?: string;
}
interface DeclarationExport extends ESMExport {
    type: "declaration";
    declaration: string;
    name: string;
}
interface NamedExport extends ESMExport {
    type: "named";
    exports: string;
    names: string[];
    specifier?: string;
}
interface DefaultExport extends ESMExport {
    type: "default";
}
declare const ESM_STATIC_IMPORT_RE: RegExp;
declare const DYNAMIC_IMPORT_RE: RegExp;
declare const EXPORT_DECAL_RE: RegExp;
declare const EXPORT_DECAL_TYPE_RE: RegExp;
declare function findStaticImports(code: string): StaticImport[];
declare function findDynamicImports(code: string): DynamicImport[];
declare function findTypeImports(code: string): TypeImport[];
declare function parseStaticImport(matched: StaticImport | TypeImport): ParsedStaticImport;
declare function parseTypeImport(matched: TypeImport | StaticImport): ParsedStaticImport;
declare function findExports(code: string): ESMExport[];
declare function findTypeExports(code: string): ESMExport[];
declare function findExportNames(code: string): string[];
declare function resolveModuleExportNames(id: string, options?: ResolveOptions): Promise<string[]>;

interface CommonjsContext {
    __filename: string;
    __dirname: string;
    require: NodeRequire;
}
declare function createCommonJS(url: string): CommonjsContext;
declare function interopDefault(sourceModule: any): any;

interface EvaluateOptions extends ResolveOptions {
    url?: string;
}
declare function loadModule(id: string, options?: EvaluateOptions): Promise<any>;
declare function evalModule(code: string, options?: EvaluateOptions): Promise<any>;
declare function transformModule(code: string, options?: EvaluateOptions): Promise<string>;
declare function resolveImports(code: string, options?: EvaluateOptions): Promise<string>;

declare function hasESMSyntax(code: string): boolean;
declare function hasCJSSyntax(code: string): boolean;
declare function detectSyntax(code: string): {
    hasESM: boolean;
    hasCJS: boolean;
    isMixed: boolean;
};
interface ValidNodeImportOptions extends ResolveOptions {
    /**
     * The contents of the import, which may be analyzed to see if it contains
     * CJS or ESM syntax as a last step in checking whether it is a valid import.
     */
    code?: string;
    /**
     * Protocols that are allowed as valid node imports.
     *
     * Default: ['node', 'file', 'data']
     */
    allowedProtocols?: Array<string>;
}
declare function isValidNodeImport(id: string, _options?: ValidNodeImportOptions): Promise<boolean>;

declare function fileURLToPath(id: string): string;
declare function sanitizeURIComponent(name?: string, replacement?: string): string;
declare function sanitizeFilePath(filePath?: string): string;
declare function normalizeid(id: string): string;
declare function loadURL(url: string): Promise<string>;
declare function toDataURL(code: string): string;
declare function isNodeBuiltin(id?: string): boolean;
declare function getProtocol(id: string): string | undefined;

export { CommonjsContext, DYNAMIC_IMPORT_RE, DeclarationExport, DefaultExport, DynamicImport, ESMExport, ESMImport, ESM_STATIC_IMPORT_RE, EXPORT_DECAL_RE, EXPORT_DECAL_TYPE_RE, EvaluateOptions, NamedExport, ParsedStaticImport, ResolveOptions, StaticImport, TypeImport, ValidNodeImportOptions, createCommonJS, createResolve, detectSyntax, evalModule, fileURLToPath, findDynamicImports, findExportNames, findExports, findStaticImports, findTypeExports, findTypeImports, getProtocol, hasCJSSyntax, hasESMSyntax, interopDefault, isNodeBuiltin, isValidNodeImport, loadModule, loadURL, lookupNodeModuleSubpath, normalizeid, parseNodeModulePath, parseStaticImport, parseTypeImport, resolve, resolveImports, resolveModuleExportNames, resolvePath, resolvePathSync, resolveSync, sanitizeFilePath, sanitizeURIComponent, toDataURL, transformModule };
