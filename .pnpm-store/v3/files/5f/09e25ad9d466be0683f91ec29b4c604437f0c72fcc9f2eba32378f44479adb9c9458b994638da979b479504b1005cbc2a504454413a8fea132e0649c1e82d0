import { AuditoryDescription } from '../audio/auditory_description';
import { KeyCode } from './event_util';
import * as FileUtil from './file_util';
import { standardLoader } from '../speech_rules/math_map';
export declare const version: string;
export declare function setupEngine(feature: {
    [key: string]: boolean | string;
}): Promise<string>;
export declare function engineSetup(): {
    [key: string]: boolean | string;
};
export declare function engineReady(): Promise<any>;
export declare const localeLoader: typeof standardLoader;
export declare function toSpeech(expr: string): string;
export declare function toSemantic(expr: string): Node;
export declare function toJson(expr: string): any;
export declare function toDescription(expr: string): AuditoryDescription[];
export declare function toEnriched(expr: string): Element;
export declare function number(expr: string): string;
export declare function ordinal(expr: string): string;
export declare function numericOrdinal(expr: string): string;
export declare function vulgar(expr: string): string;
export declare const file: Record<string, (input: string, output?: string) => any>;
export declare function processFile(processor: string, input: string, opt_output?: string): string | Promise<string>;
export declare function walk(expr: string): string;
export declare function move(direction: KeyCode | string): string | null;
export declare function exit(opt_value?: number): void;
export declare const localePath: typeof FileUtil.localePath;
