import Errlop from 'errlop';
interface ErrtionOptions {
    message: string;
    code: string | number;
    level?: string | number;
}
interface Errtion extends Errlop, ErrtionOptions {
}
/**
 * Allow code and level inputs on Errlop.
 * We do this instead of a class extension, as class extensions do not interop well on node 0.8, which is our target.
 */
export declare function errtion(this: void, opts: ErrtionOptions, parent?: Errlop | Error): Errtion;
/** Converts anything to a string, by returning strings and serialising objects. */
export declare function stringify(value: any): string;
/** Converts a version range like `4 || 6` to `>=4` */
export declare function simplifyRange(range: string): string;
export {};
//# sourceMappingURL=util.d.ts.map