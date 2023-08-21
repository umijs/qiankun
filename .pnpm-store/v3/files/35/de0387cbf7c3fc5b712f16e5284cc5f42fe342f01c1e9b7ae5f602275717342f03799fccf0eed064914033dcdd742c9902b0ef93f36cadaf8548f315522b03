/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as child_process from 'child_process';
import { EnvironmentMap } from './EnvironmentMap';
/**
 * Typings for one of the streams inside IExecutableSpawnSyncOptions.stdio.
 * @public
 */
export type ExecutableStdioStreamMapping = 'pipe' | 'ignore' | 'inherit' | NodeJS.WritableStream | NodeJS.ReadableStream | number | undefined;
/**
 * Types for {@link IExecutableSpawnSyncOptions.stdio}
 * and {@link IExecutableSpawnOptions.stdio}
 * @public
 */
export type ExecutableStdioMapping = 'pipe' | 'ignore' | 'inherit' | ExecutableStdioStreamMapping[];
/**
 * Options for Executable.tryResolve().
 * @public
 */
export interface IExecutableResolveOptions {
    /**
     * The current working directory.  If omitted, process.cwd() will be used.
     */
    currentWorkingDirectory?: string;
    /**
     * The environment variables for the child process.
     *
     * @remarks
     * If `environment` and `environmentMap` are both omitted, then `process.env` will be used.
     * If `environment` and `environmentMap` cannot both be specified.
     */
    environment?: NodeJS.ProcessEnv;
    /**
     * The environment variables for the child process.
     *
     * @remarks
     * If `environment` and `environmentMap` are both omitted, then `process.env` will be used.
     * If `environment` and `environmentMap` cannot both be specified.
     */
    environmentMap?: EnvironmentMap;
}
/**
 * Options for {@link Executable.spawnSync}
 * @public
 */
export interface IExecutableSpawnSyncOptions extends IExecutableResolveOptions {
    /**
     * The content to be passed to the child process's stdin.
     *
     * NOTE: If specified, this content replaces any IExecutableSpawnSyncOptions.stdio[0]
     * mapping for stdin.
     */
    input?: string;
    /**
     * The stdio mappings for the child process.
     *
     * NOTE: If IExecutableSpawnSyncOptions.input is provided, it will take precedence
     * over the stdin mapping (stdio[0]).
     */
    stdio?: ExecutableStdioMapping;
    /**
     * The maximum time the process is allowed to run before it will be terminated.
     */
    timeoutMs?: number;
    /**
     * The largest amount of bytes allowed on stdout or stderr for this synchronous operation.
     * If exceeded, the child process will be terminated.  The default is 200 * 1024.
     */
    maxBuffer?: number;
}
/**
 * Options for {@link Executable.spawn}
 * @public
 */
export interface IExecutableSpawnOptions extends IExecutableResolveOptions {
    /**
     * The stdio mappings for the child process.
     *
     * NOTE: If IExecutableSpawnSyncOptions.input is provided, it will take precedence
     * over the stdin mapping (stdio[0]).
     */
    stdio?: ExecutableStdioMapping;
}
/**
 * The Executable class provides a safe, portable, recommended solution for tools that need
 * to launch child processes.
 *
 * @remarks
 * The NodeJS child_process API provides a solution for launching child processes, however
 * its design encourages reliance on the operating system shell for certain features.
 * Invoking the OS shell is not safe, not portable, and generally not recommended:
 *
 * - Different shells have different behavior and command-line syntax, and which shell you
 *   will get with NodeJS is unpredictable.  There is no universal shell guaranteed to be
 *   available on all platforms.
 *
 * - If a command parameter contains symbol characters, a shell may interpret them, which
 *   can introduce a security vulnerability
 *
 * - Each shell has different rules for escaping these symbols.  On Windows, the default
 *   shell is incapable of escaping certain character sequences.
 *
 * The Executable API provides a pure JavaScript implementation of primitive shell-like
 * functionality for searching the default PATH, appending default file extensions on Windows,
 * and executing a file that may contain a POSIX shebang.  This primitive functionality
 * is sufficient (and recommended) for most tooling scenarios.
 *
 * If you need additional shell features such as wildcard globbing, environment variable
 * expansion, piping, or built-in commands, then we recommend to use the `@microsoft/rushell`
 * library instead.  Rushell is a pure JavaScript shell with a standard syntax that is
 * guaranteed to work consistently across all platforms.
 *
 * @public
 */
export declare class Executable {
    /**
     * Synchronously create a child process and optionally capture its output.
     *
     * @remarks
     * This function is similar to child_process.spawnSync().  The main differences are:
     *
     * - It does not invoke the OS shell unless the executable file is a shell script.
     * - Command-line arguments containing special characters are more accurately passed
     *   through to the child process.
     * - If the filename is missing a path, then the shell's default PATH will be searched.
     * - If the filename is missing a file extension, then Windows default file extensions
     *   will be searched.
     *
     * @param filename - The name of the executable file.  This string must not contain any
     * command-line arguments.  If the name contains any path delimiters, then the shell's
     * default PATH will not be searched.
     * @param args - The command-line arguments to be passed to the process.
     * @param options - Additional options
     * @returns the same data type as returned by the NodeJS child_process.spawnSync() API
     *
     * @privateRemarks
     *
     * NOTE: The NodeJS spawnSync() returns SpawnSyncReturns<string> or SpawnSyncReturns<Buffer>
     * polymorphically based on the options.encoding parameter value.  This is a fairly confusing
     * design.  In most cases, developers want string with the default encoding.  If/when someone
     * wants binary output or a non-default text encoding, we will introduce a separate API function
     * with a name like "spawnWithBufferSync".
     */
    static spawnSync(filename: string, args: string[], options?: IExecutableSpawnSyncOptions): child_process.SpawnSyncReturns<string>;
    /**
     * Start a child process.
     *
     * @remarks
     * This function is similar to child_process.spawn().  The main differences are:
     *
     * - It does not invoke the OS shell unless the executable file is a shell script.
     * - Command-line arguments containing special characters are more accurately passed
     *   through to the child process.
     * - If the filename is missing a path, then the shell's default PATH will be searched.
     * - If the filename is missing a file extension, then Windows default file extensions
     *   will be searched.
     *
     * This command is asynchronous, but it does not return a `Promise`.  Instead it returns
     * a Node.js `ChildProcess` supporting event notifications.
     *
     * @param filename - The name of the executable file.  This string must not contain any
     * command-line arguments.  If the name contains any path delimiters, then the shell's
     * default PATH will not be searched.
     * @param args - The command-line arguments to be passed to the process.
     * @param options - Additional options
     * @returns the same data type as returned by the NodeJS child_process.spawnSync() API
     */
    static spawn(filename: string, args: string[], options?: IExecutableSpawnOptions): child_process.ChildProcess;
    private static _buildCommandLineFixup;
    /**
     * Given a filename, this determines the absolute path of the executable file that would
     * be executed by a shell:
     *
     * - If the filename is missing a path, then the shell's default PATH will be searched.
     * - If the filename is missing a file extension, then Windows default file extensions
     *   will be searched.
     *
     * @remarks
     *
     * @param filename - The name of the executable file.  This string must not contain any
     * command-line arguments.  If the name contains any path delimiters, then the shell's
     * default PATH will not be searched.
     * @param options - optional other parameters
     * @returns the absolute path of the executable, or undefined if it was not found
     */
    static tryResolve(filename: string, options?: IExecutableResolveOptions): string | undefined;
    private static _tryResolve;
    private static _tryResolveFileExtension;
    private static _buildEnvironmentMap;
    /**
     * This is used when searching the shell PATH for an executable, to determine
     * whether a match should be skipped or not.  If it returns true, this does not
     * guarantee that the file can be successfully executed.
     */
    private static _canExecute;
    /**
     * Returns the list of folders where we will search for an executable,
     * based on the PATH environment variable.
     */
    private static _getSearchFolders;
    private static _getExecutableContext;
    /**
     * Given an input string containing special symbol characters, this inserts the "^" escape
     * character to ensure the symbols are interpreted literally by the Windows shell.
     */
    private static _getEscapedForWindowsShell;
    /**
     * Checks for characters that are unsafe to pass to a Windows batch file
     * due to the way that cmd.exe implements escaping.
     */
    private static _validateArgsForWindowsShell;
}
//# sourceMappingURL=Executable.d.ts.map