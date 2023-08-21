declare type AnyConfig<T extends Record<string, any>, U extends Record<string, any>> = {
    [V in keyof U]: V extends keyof T ? U[V] extends (...args: any[]) => any ? (argv: T[V]) => T[V] : T[V] : U[V];
};
declare type CalculatedConfig<T extends Record<string, any>, U extends Record<string, any>> = T & {
    [V in keyof U]: V extends keyof T ? T[V] : U[V];
};
export default function mergeConfig<T extends Record<string, any>, U extends Record<string, any>>(defaultConfig: T, ...configs: (AnyConfig<T, U> | null | undefined)[]): CalculatedConfig<T, U>;
export {};
