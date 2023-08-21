import { ResolveOptions as ResolveOptions$1 } from 'mlly';
import { CompilerOptions, TypeAcquisition } from 'typescript';

interface FindFileOptions {
    /**
     * The starting directory for the search.
     * @default . (same as `process.cwd()`)
     */
    startingFrom?: string;
    /**
     * A pattern to match a path segment above which you don't want to ascend
     * @default /^node_modules$/
     */
    rootPattern?: RegExp;
    /**
     * If true, search starts from root level descending into subdirectories
     */
    reverse?: boolean;
    /**
     * A matcher that can evaluate whether the given path is a valid file (for example,
     * by testing whether the file path exists.
     *
     * @default fs.statSync(path).isFile()
     */
    test?: (filePath: string) => boolean | undefined | Promise<boolean | undefined>;
}
/** @deprecated */
type FindNearestFileOptions = FindFileOptions;
declare function findFile(filename: string, _options?: FindFileOptions): Promise<string>;
declare function findNearestFile(filename: string, _options?: FindFileOptions): Promise<string>;
declare function findFarthestFile(filename: string, _options?: FindFileOptions): Promise<string>;

type StripEnums<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends boolean ? T[K] : T[K] extends string ? T[K] : T[K] extends object ? T[K] : T[K] extends Array<any> ? T[K] : T[K] extends undefined ? undefined : any;
};
interface TSConfig {
    compilerOptions?: StripEnums<CompilerOptions>;
    exclude?: string[];
    compileOnSave?: boolean;
    extends?: string;
    files?: string[];
    include?: string[];
    typeAcquisition?: TypeAcquisition;
}

/**
 * A “person” is an object with a “name” field and optionally “url” and “email”. Or you can shorten that all into a single string, and npm will parse it for you.
 */
type PackageJsonPerson = string | {
    name: string;
    email?: string;
    url?: string;
};
interface PackageJson {
    /**
       * The name is what your thing is called.
       * Some rules:
  
           - The name must be less than or equal to 214 characters. This includes the scope for scoped packages.
           - The name can’t start with a dot or an underscore.
           - New packages must not have uppercase letters in the name.
           - The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can’t contain any non-URL-safe characters.
  
       */
    name?: string;
    /**
     * Version must be parseable by `node-semver`, which is bundled with npm as a dependency. (`npm install semver` to use it yourself.)
     */
    version?: string;
    /**
     * Put a description in it. It’s a string. This helps people discover your package, as it’s listed in `npm search`.
     */
    description?: string;
    /**
     * Put keywords in it. It’s an array of strings. This helps people discover your package as it’s listed in `npm search`.
     */
    keywords?: string[];
    /**
     * The url to the project homepage.
     */
    homepage?: string;
    /**
     * The url to your project’s issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.
     */
    bugs?: string | {
        url?: string;
        email?: string;
    };
    /**
     * You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you’re placing on it.
     */
    license?: string;
    /**
     * Specify the place where your code lives. This is helpful for people who want to contribute. If the git repo is on GitHub, then the `npm docs` command will be able to find you.
     * For GitHub, GitHub gist, Bitbucket, or GitLab repositories you can use the same shortcut syntax you use for npm install:
     */
    repository?: string | {
        type: string;
        url: string;
        /**
         * If the `package.json` for your package is not in the root directory (for example if it is part of a monorepo), you can specify the directory in which it lives:
         */
        directory?: string;
    };
    scripts?: Record<string, string>;
    /**
     * If you set `"private": true` in your package.json, then npm will refuse to publish it.
     */
    private?: boolean;
    /**
     * The “author” is one person.
     */
    author?: PackageJsonPerson;
    /**
     * “contributors” is an array of people.
     */
    contributors?: PackageJsonPerson[];
    /**
     * The optional `files` field is an array of file patterns that describes the entries to be included when your package is installed as a dependency. File patterns follow a similar syntax to `.gitignore`, but reversed: including a file, directory, or glob pattern (`*`, `**\/*`, and such) will make it so that file is included in the tarball when it’s packed. Omitting the field will make it default to `["*"]`, which means it will include all files.
     */
    files?: string[];
    /**
     * The main field is a module ID that is the primary entry point to your program. That is, if your package is named `foo`, and a user installs it, and then does `require("foo")`, then your main module’s exports object will be returned.
     * This should be a module ID relative to the root of your package folder.
     * For most modules, it makes the most sense to have a main script and often not much else.
     */
    main?: string;
    /**
     * If your module is meant to be used client-side the browser field should be used instead of the main field. This is helpful to hint users that it might rely on primitives that aren’t available in Node.js modules. (e.g. window)
     */
    browser?: string;
    /**
     * A map of command name to local file name. On install, npm will symlink that file into `prefix/bin` for global installs, or `./node_modules/.bin/` for local installs.
     */
    bin?: string | Record<string, string>;
    /**
     * Specify either a single file or an array of filenames to put in place for the `man` program to find.
     */
    man?: string | string[];
    /**
     * Dependencies are specified in a simple object that maps a package name to a version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL.
     */
    dependencies?: Record<string, string>;
    /**
     * If someone is planning on downloading and using your module in their program, then they probably don’t want or need to download and build the external test or documentation framework that you use.
     * In this case, it’s best to map these additional items in a `devDependencies` object.
     */
    devDependencies?: Record<string, string>;
    /**
     * If a dependency can be used, but you would like npm to proceed if it cannot be found or fails to install, then you may put it in the `optionalDependencies` object. This is a map of package name to version or url, just like the `dependencies` object. The difference is that build failures do not cause installation to fail.
     */
    optionalDependencies?: Record<string, string>;
    /**
     * In some cases, you want to express the compatibility of your package with a host tool or library, while not necessarily doing a `require` of this host. This is usually referred to as a plugin. Notably, your module may be exposing a specific interface, expected and specified by the host documentation.
     */
    peerDependencies?: Record<string, string>;
    /**
     * TypeScript typings, typically ending by .d.ts
     */
    types?: string;
    typings?: string;
    /**
     * Non-Standard Node.js alternate entry-point to main.
     * An initial implementation for supporting CJS packages (from main), and use module for ESM modules.
     */
    module?: string;
    /**
     * Make main entry-point be loaded as an ESM module, support "export" syntax instead of "require"
     *
     * Docs:
     * - https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_package_json_type_field
     *
     * @default 'commonjs'
     * @since Node.js v14
     */
    type?: "module" | "commonjs";
    /**
     * Alternate and extensible alternative to "main" entry point.
     *
     * When using `{type: "module"}`, any ESM module file MUST end with `.mjs` extension.
     *
     * Docs:
     * - https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_exports_sugar
     *
     * @default 'commonjs'
     * @since Node.js v14
     */
    exports?: string | Record<"import" | "require" | "." | "node" | "browser" | string, string | Record<"import" | "require" | string, string>>;
    workspaces?: string[];
    [key: string]: any;
}

type ResolveOptions = ResolveOptions$1 & FindFileOptions;
type ReadOptions = {
    cache?: boolean | Map<string, Record<string, any>>;
};
declare function definePackageJSON(package_: PackageJson): PackageJson;
declare function defineTSConfig(tsconfig: TSConfig): TSConfig;
declare function readPackageJSON(id?: string, options?: ResolveOptions & ReadOptions): Promise<PackageJson>;
declare function writePackageJSON(path: string, package_: PackageJson): Promise<void>;
declare function readTSConfig(id?: string, options?: ResolveOptions & ReadOptions): Promise<TSConfig>;
declare function writeTSConfig(path: string, tsconfig: TSConfig): Promise<void>;
declare function resolvePackageJSON(id?: string, options?: ResolveOptions): Promise<string>;
declare function resolveTSConfig(id?: string, options?: ResolveOptions): Promise<string>;
declare function resolveLockfile(id?: string, options?: ResolveOptions): Promise<string>;
declare function findWorkspaceDir(id?: string, options?: ResolveOptions): Promise<string>;

export { FindFileOptions, FindNearestFileOptions, PackageJson, PackageJsonPerson, ReadOptions, ResolveOptions, StripEnums, TSConfig, definePackageJSON, defineTSConfig, findFarthestFile, findFile, findNearestFile, findWorkspaceDir, readPackageJSON, readTSConfig, resolveLockfile, resolvePackageJSON, resolveTSConfig, writePackageJSON, writeTSConfig };
