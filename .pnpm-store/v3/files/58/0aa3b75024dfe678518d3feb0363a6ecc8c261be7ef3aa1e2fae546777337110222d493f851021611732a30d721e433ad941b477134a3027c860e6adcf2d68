import type webpack from 'webpack';
export interface InfrastructureLogger {
    log(...args: unknown[]): void;
    debug(...args: unknown[]): void;
    error(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    info(...args: unknown[]): void;
}
export declare function getInfrastructureLogger(compiler: webpack.Compiler): InfrastructureLogger;
