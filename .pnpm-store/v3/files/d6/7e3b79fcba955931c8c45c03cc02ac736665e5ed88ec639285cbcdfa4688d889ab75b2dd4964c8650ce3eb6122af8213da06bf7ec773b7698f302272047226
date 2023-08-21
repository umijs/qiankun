export declare enum Axis {
    DOMAIN = "domain",
    STYLE = "style",
    LOCALE = "locale",
    TOPIC = "topic",
    MODALITY = "modality"
}
export declare type AxisProperties = {
    [key: string]: string[];
};
export declare type AxisOrder = Axis[];
export declare type AxisValues = {
    [key: string]: boolean;
};
export declare type AxisMap = {
    [key: string]: string;
};
export declare class DynamicProperties {
    private properties;
    protected order: AxisOrder;
    static createProp(...cstrList: string[][]): DynamicProperties;
    constructor(properties: AxisProperties, order?: AxisOrder);
    getProperties(): AxisProperties;
    getOrder(): AxisOrder;
    getAxes(): AxisOrder;
    getProperty(key: Axis): string[];
    updateProperties(props: AxisProperties): void;
    allProperties(): string[][];
    toString(): string;
}
export declare class DynamicCstr extends DynamicProperties {
    static DEFAULT_ORDER: AxisOrder;
    static BASE_LOCALE: string;
    static DEFAULT_VALUE: string;
    static DEFAULT_VALUES: AxisMap;
    private components;
    static createCstr(...cstrList: string[]): DynamicCstr;
    static defaultCstr(): DynamicCstr;
    static validOrder(order: AxisOrder): boolean;
    constructor(components_: AxisMap, order?: AxisOrder);
    getComponents(): AxisMap;
    getValue(key: Axis): string;
    getValues(): string[];
    allProperties(): string[][];
    toString(): string;
    equal(cstr: DynamicCstr): boolean;
}
export declare class DynamicCstrParser {
    private order;
    constructor(order: AxisOrder);
    parse(str: string): DynamicCstr;
}
export interface Comparator {
    getReference(): DynamicCstr;
    setReference(cstr: DynamicCstr, opt_props?: DynamicProperties): void;
    match(cstr: DynamicCstr): boolean;
    compare(cstr1: DynamicCstr, cstr2: DynamicCstr): number;
}
export declare class DefaultComparator implements Comparator {
    private reference;
    private fallback;
    private order;
    constructor(reference: DynamicCstr, fallback?: DynamicProperties);
    getReference(): DynamicCstr;
    setReference(cstr: DynamicCstr, props?: DynamicProperties): void;
    match(cstr: DynamicCstr): boolean;
    compare(cstr1: DynamicCstr, cstr2: DynamicCstr): 0 | 1 | -1;
    toString(): string;
}
