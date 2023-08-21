import { SiJson, MappingsJson, SimpleRule, UnicodeJson } from './math_simple_store';
import { DynamicCstr } from './dynamic_cstr';
export declare function setSiPrefixes(prefixes: SiJson): void;
export declare function defineRules(name: string, str: string, cat: string, mappings: MappingsJson): void;
export declare function defineRule(name: string, domain: string, style: string, cat: string, str: string, content: string): void;
export declare function addSymbolRules(json: UnicodeJson): void;
export declare function addFunctionRules(json: UnicodeJson): void;
export declare function addUnitRules(json: UnicodeJson): void;
export declare function addSiUnitRules(json: UnicodeJson): void;
export declare function lookupRule(node: string, dynamic: DynamicCstr): SimpleRule;
export declare function lookupCategory(character: string): string;
export declare function lookupString(text: string, dynamic: DynamicCstr): string;
export declare function enumerate(info?: {
    [key: string]: any;
}): {
    [key: string]: any;
};
