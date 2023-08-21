import { f as ViteNodeServerOptions } from './types-e8623e9c.js';
import 'vite/types/hot';
import './types.d-7442d07f.js';

interface CliOptions {
    root?: string;
    script?: boolean;
    config?: string;
    mode?: string;
    watch?: boolean;
    options?: ViteNodeServerOptionsCLI;
    version?: boolean;
    help?: boolean;
    '--'?: string[];
}
type Optional<T> = T | undefined;
type ComputeViteNodeServerOptionsCLI<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends Optional<RegExp[]> ? string | string[] : T[K] extends Optional<(string | RegExp)[]> ? string | string[] : T[K] extends Optional<(string | RegExp)[] | true> ? string | string[] | true : T[K] extends Optional<Record<string, any>> ? ComputeViteNodeServerOptionsCLI<T[K]> : T[K];
};
type ViteNodeServerOptionsCLI = ComputeViteNodeServerOptionsCLI<ViteNodeServerOptions>;

export { CliOptions, ViteNodeServerOptionsCLI };
