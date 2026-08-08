/**
 * Public, Compartment-shaped module loading contracts.
 *
 * These types deliberately live in shared so the sandbox can implement the
 * facade without making shared depend on the sandbox package.
 */

export type ModuleNamespace = Record<string, unknown>;

/**
 * A module source that has already passed through qiankun's linking rewrite.
 * Returning this shape from an import hook skips both the default fetch and
 * the initial rewrite step. Dependencies must already be canonical specifiers.
 * The original source is retained so collision probing can rebuild the module
 * with a smaller injected-globals set without recalling the hook.
 */
export type ModuleSource = {
  /** Instance key used when code was linked; public precompiled artifacts use the stable placeholder. */
  instanceKey: string;
  /** Original, unlinked module input used if collision probing must rebuild the linked code. */
  source: string;
  code: string;
  deps: string[];
  typedDeps: string[];
  destructured: string[];
  importMetaUrl: string;
};

export type ModuleDescriptor =
  | {
      source: string | ModuleSource;
      namespace?: never;
      specifier?: never;
    }
  | {
      namespace: ModuleNamespace;
      source?: never;
      specifier?: never;
    }
  | {
      specifier: string;
      source?: never;
      namespace?: never;
    };

/** Resolve an import request to the canonical key used by modules/importHook. */
export type ResolveHook = (specifier: string, referrer: string) => string;

/**
 * Supply one module descriptor for a canonical specifier. The engine memoizes
 * the returned promise, including rejection, for its lifetime. Probe rebuilding
 * never recalls the hook, so a hook must be idempotent and describe a stable
 * module graph.
 */
export type ImportHook = (fullSpecifier: string) => Promise<ModuleDescriptor>;

/** Descriptor table consulted before importHook. Redirects use canonical keys. */
export type Modules = Record<string, ModuleDescriptor>;

type DocumentModuleOptions = {
  baseUrl: string;
  isEntry?: boolean;
  /** Fetch credentials inherited by this document module and its static dependency graph. */
  credentials?: RequestInit['credentials'];
};

/** A document module is either external or inline, never both (or neither). */
export type DocumentModule = DocumentModuleOptions &
  (
    | {
        url: string;
        code?: never;
      }
    | {
        code: string;
        url?: never;
      }
  );

/** Structural facade consumed by the loader and DOM asset transpilers. */
export interface CompartmentModuleFacade {
  import(specifier: string): Promise<ModuleNamespace>;
  load(specifier: string): Promise<void>;
  importDocumentModules(): Promise<ModuleNamespace | undefined>;
  registerDocumentModule(module: DocumentModule): void;
  registerImportMap(mapText: string, baseUrl: string): void;
  dispose(): void;
}
