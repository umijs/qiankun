import type { DepModule } from './depInfo';
declare class ModuleNode {
    file: string;
    importers: Set<ModuleNode>;
    importedModules: Set<ModuleNode>;
    isDependency: boolean;
    isRoot: boolean;
    version: string | null;
    constructor(file: string);
}
interface IDep {
    file: string;
    isDependency: boolean;
    version?: string;
}
export declare class ModuleGraph {
    fileToModules: Map<string, ModuleNode>;
    depToModules: Map<string, ModuleNode>;
    depSnapshotModules: Record<string, DepModule>;
    rootModules: Set<ModuleNode>;
    constructor();
    restore(data: {
        roots: any;
        fileModules: any;
        depModules: any;
        depSnapshotModules: any;
    }): void;
    toJSON(): {
        roots: string[];
        fileModules: Record<string, {
            importedModules: string[];
            isRoot?: boolean | undefined;
        }>;
        depModules: Record<string, {
            version: string | null;
        }>;
        depSnapshotModules: Record<string, DepModule>;
    };
    snapshotDeps(): void;
    getDepsInfo(mods: Map<string, ModuleNode>): Record<string, {
        file: string;
        version: string;
    }>;
    getDepInfo(mod: ModuleNode): {
        file: string;
        version: string;
        importer: string;
    };
    hasDepChanged(): boolean;
    onFileChange(opts: {
        file: string;
        deps: IDep[];
    }): void;
    updateModule(opts: {
        mod: ModuleNode;
        deps: IDep[];
    }): void;
    addNode(opts: {
        file: string;
        isDependency: boolean;
        importer: ModuleNode;
        version?: string | null;
    }): void;
    deleteNode(opts: {
        mod: ModuleNode;
        importer: ModuleNode;
    }): void;
}
export {};
