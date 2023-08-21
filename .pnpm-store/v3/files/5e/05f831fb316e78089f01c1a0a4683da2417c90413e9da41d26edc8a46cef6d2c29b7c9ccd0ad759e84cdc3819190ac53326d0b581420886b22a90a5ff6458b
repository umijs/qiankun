/// <reference types="hapi__joi" />
import { Schema } from '@umijs/deps/types/joi2types/@hapi/joi';
import { compile } from '@umijs/deps/types/joi2types/json-schema-to-typescript';
export interface Options {
    additionalProperties?: boolean;
    interfaceName?: string;
    bannerComment?: string;
    format?: boolean;
}
export declare const defaultOptions: {
    interfaceName: string;
    bannerComment: string;
    format: boolean;
};
declare const _default: (schema: Schema, options?: Options) => Promise<string>;
/**
 * convert into types
 */
export default _default;
export declare const jsonSchema2Types: typeof compile;
export declare const joi2JsonSchema: import('./transformer').Parser<Schema>;
