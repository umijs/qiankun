import { DynamicCstr } from './dynamic_cstr';
export interface MappingsJson {
    default: {
        [key: string]: string;
    };
    [domainName: string]: {
        [key: string]: string;
    };
}
export interface UnicodeJson {
    key: string;
    category: string;
    names?: string[];
    si?: boolean;
    mappings: MappingsJson;
    modality?: string;
    locale?: string;
    domain?: string;
}
export interface SiJson {
    [key: string]: string;
}
export interface SimpleRule {
    cstr: DynamicCstr;
    action: string;
}
export declare class MathSimpleStore {
    category: string;
    rules: Map<string, SimpleRule[]>;
    static parseUnicode(num: string): string;
    private static testDynamicConstraints_;
    defineRulesFromMappings(name: string, locale: string, modality: string, str: string, mapping: MappingsJson): void;
    getRules(key: string): SimpleRule[];
    defineRuleFromStrings(_name: string, locale: string, modality: string, domain: string, style: string, _str: string, content: string): void;
    lookupRule(_node: Node, dynamic: DynamicCstr): SimpleRule;
}
