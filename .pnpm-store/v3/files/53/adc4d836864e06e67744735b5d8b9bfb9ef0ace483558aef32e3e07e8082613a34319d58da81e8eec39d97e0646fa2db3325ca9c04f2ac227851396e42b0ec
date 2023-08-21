/// <reference types="node" />
/** Edition entries must conform to the following specification. */
export interface Edition {
    /**
     * Use this property to decribe the edition in human readable terms. Such as what it does and who it is for. It is used to reference the edition in user facing reporting, such as error messages.
     * @example "esnext source code with require for modules"
     */
    description: String;
    /**
     * The location to where this directory is located. It should be a relative path from the `package.json` file.
     * @example "source"
     */
    directory: string;
    /**
     * The default entry location for this edition, relative to the edition's directory.
     * @example "index.js"
     */
    entry?: string;
    /**
     * Any keywords you wish to associate to the edition. Useful for various ecosystem tooling, such as automatic ESNext lint configuration if the `esnext` tag is present in the source edition tags. Consumers also make use of this via {@link EDITIONS_TAG_BLACKLIST} for preventing loading editions that contain a blacklisted tag. Previously this field was named `syntaxes`.
     * @example ["javascript", "esnext", "require"]
     */
    tags?: string[];
    /** @alias tags */
    syntaxes?: Edition['tags'];
    /**
     * This field is used to specific which Node.js and Browser environments this edition supports. If `false` this edition does not support either. If `node` is a string, it should be a semver range of node.js versions that the edition targets. If `browsers` is a string, it should be a [browserlist](https://github.com/browserslist/browserslist) value of the specific browser values the edition targets. If `node` or `browsers` is true, it indicates that this edition is compatible with those environments.
     * @example
     * {
     *   "description": "esnext source code with require for modules",
     *   "directory": "source",
     *   "entry": "index.js",
     *   "tags": [
     *     "javascript",
     *     "esnext",
     *     "require"
     *   ],
     *   "engines": {
     *     "node": ">=6",
     *     "browsers": "defaults"
     *   }
     * }
     */
    engines?: false | {
        [engine: string]: string | boolean;
    };
}
/** These are the various options that you can use to customise the behaviour of certain methods. */
export interface EditionOptions {
    /** The require method of the calling module, used to ensure require paths remain correct. */
    require: Function;
    /** If provided, this is used for debugging. */
    packagePath?: string;
    /** If provided, any error loading an edition will be logged. By default, errors are only logged if all editions failed. If not provided, process.env.EDITIONS_VERBOSE is used. */
    verbose?: boolean;
    /** If `true`, then only exact version matches will be loaded. If `false`, then likely matches using {@link simplifyRange} will be evaluated, with a fallback to the last. If missing, then `true` is attempted first and if no result, then `false` is attempted. */
    strict?: boolean;
    /** If provided, this will be the cwd for entries. */
    cwd?: string;
    /** If provided, should be a relative path to the entry point of the edition. */
    entry?: string;
    /** If provided, should be the name of the package that we are loading the editions for. */
    package?: string;
    /** If not provided, will use process.stderr instead. It is the stream that verbose errors are logged to. */
    stderr?: NodeJS.WritableStream;
}
/**
 * Attempt to load a specific {@link Edition}.
 * @returns The result of the loaded edition.
 * @throws An error if the edition failed to load.
 */
export declare function loadEdition(edition: Edition, opts: EditionOptions): any;
/**
 * Attempt to require an {@link Edition}, based on its compatibility with the current environment, such as {@link NODE_VERSION} and {@link EDITIONS_TAG_BLACKLIST} compatibility.
 * If compatibility is established with the environment, it will load the edition using {@link loadEdition}.
 * @returns The result of the loaded edition
 * @throws An error if the edition failed to load
 */
export declare function requireEdition(edition: Edition, opts: EditionOptions): any;
/**
 * Cycles through a list of editions, returning the require result of the first suitable {@link Edition} that it was able to load.
 * Editions should be ordered from most preferable first, to least desirable last.
 * Providing the editions configuration is valid, individual edition handling is forwarded to {@link requireEdition}.
 * @returns The result of the loaded edition.
 * @throws An error if a suitable edition was unable to be resolved.
 */
export declare function requireEditions(editions: Edition[], opts: EditionOptions): any;
/**
 * Cycle through the editions for a package and require the correct one.
 * Providing the package configuration is valid, editions handling is forwarded to {@link requireEditions}.
 * @returns The result of the loaded edition.
 * @throws An error if a suitable edition was unable to be resolved.
 */
export declare function requirePackage(cwd: EditionOptions['cwd'], require: EditionOptions['require'], entry: EditionOptions['entry']): any;
//# sourceMappingURL=index.d.ts.map