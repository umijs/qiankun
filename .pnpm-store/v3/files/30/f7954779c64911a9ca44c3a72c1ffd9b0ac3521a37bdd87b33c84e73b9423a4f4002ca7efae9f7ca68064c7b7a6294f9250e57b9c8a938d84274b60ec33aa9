import { SVG } from '../svg.js';
export declare class FontCache<N, T, D> {
    protected jax: SVG<N, T, D>;
    protected cache: Map<string, string>;
    protected defs: N;
    protected localID: string;
    protected nextID: number;
    constructor(jax: SVG<N, T, D>);
    cachePath(variant: string, C: string, path: string): string;
    clearLocalID(): void;
    useLocalID(id?: string): void;
    clearCache(): void;
    getCache(): N;
}
