import { DynamicCstr } from '../rule_engine/dynamic_cstr';
import { AxisMap, AxisProperties, DefaultComparator, DynamicCstrParser, DynamicProperties } from '../rule_engine/dynamic_cstr';
import { SemanticNode } from '../semantic_tree/semantic_node';
export declare class ClearspeakPreferences extends DynamicCstr {
    preference: {
        [key: string]: string;
    };
    private static AUTO;
    static comparator(): Comparator;
    static fromPreference(pref: string): AxisMap;
    static toPreference(pref: AxisMap): string;
    static getLocalePreferences(opt_dynamic?: {
        [key: string]: AxisProperties;
    }): {
        [key: string]: AxisProperties;
    };
    static smartPreferences(item: any, locale: string): AxisMap[];
    static relevantPreferences(node: SemanticNode): string;
    static findPreference(prefs: string, kind: string): string;
    static addPreference(prefs: string, kind: string, value: string): string;
    private static getLocalePreferences_;
    constructor(cstr: AxisMap, preference: {
        [key: string]: string;
    });
    equal(cstr: ClearspeakPreferences): boolean;
}
export declare class Comparator extends DefaultComparator {
    preference: AxisMap;
    constructor(cstr: DynamicCstr, props: DynamicProperties);
    match(cstr: DynamicCstr): boolean;
    compare(cstr1: DynamicCstr, cstr2: DynamicCstr): 0 | 1 | -1;
}
export declare class Parser extends DynamicCstrParser {
    constructor();
    parse(str: string): ClearspeakPreferences;
    fromPreference(pref: string): {
        [key: string]: string;
    };
    toPreference(pref: {
        [key: string]: string;
    }): string;
}
