import { AuditoryDescription } from '../audio/auditory_description';
import * as Dcstr from '../rule_engine/dynamic_cstr';
import * as EngineConst from './engine_const';
export declare class SREError extends Error {
    message: string;
    name: string;
    constructor(message?: string);
}
export default class Engine {
    static BINARY_FEATURES: string[];
    static STRING_FEATURES: string[];
    private static instance;
    customLoader: (locale: string) => Promise<string>;
    evaluator: (p1: string, p2: Dcstr.DynamicCstr) => string | null;
    defaultParser: Dcstr.DynamicCstrParser;
    parser: Dcstr.DynamicCstrParser;
    parsers: {
        [key: string]: Dcstr.DynamicCstrParser;
    };
    dynamicCstr: Dcstr.DynamicCstr;
    comparator: Dcstr.Comparator;
    mode: EngineConst.Mode;
    init: boolean;
    delay: boolean;
    comparators: {
        [key: string]: () => Dcstr.Comparator;
    };
    domain: string;
    style: string;
    _defaultLocale: string;
    set defaultLocale(loc: string);
    get defaultLocale(): string;
    locale: string;
    subiso: string;
    modality: string;
    speech: EngineConst.Speech;
    markup: EngineConst.Markup;
    walker: string;
    structure: boolean;
    ruleSets: string[];
    strict: boolean;
    isIE: boolean;
    isEdge: boolean;
    rate: string;
    pprint: boolean;
    config: boolean;
    rules: string;
    prune: string;
    static getInstance(): Engine;
    static defaultEvaluator(str: string, _cstr: Dcstr.DynamicCstr): string;
    static nodeEvaluator: (node: Element) => AuditoryDescription[];
    static evaluateNode(node: Element): AuditoryDescription[];
    getRate(): number;
    setDynamicCstr(opt_dynamic?: Dcstr.AxisMap): void;
    private constructor();
    configurate(feature: {
        [key: string]: boolean | string;
    }): void;
    setCustomLoader(fn: any): void;
}
export declare class EnginePromise {
    static loaded: {
        [locale: string]: [boolean, boolean];
    };
    static promises: {
        [locale: string]: Promise<string>;
    };
    static get(locale?: string): Promise<string>;
    static getall(): Promise<string[]>;
}
