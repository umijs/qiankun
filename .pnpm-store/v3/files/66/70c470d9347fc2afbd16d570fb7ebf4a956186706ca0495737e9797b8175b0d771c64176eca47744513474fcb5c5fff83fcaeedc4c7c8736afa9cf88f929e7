export declare function isObject(obj: any): boolean;
export declare type OptionList = {
    [name: string]: any;
};
export declare const APPEND = "[+]";
export declare const REMOVE = "[-]";
export declare const OPTIONS: {
    invalidOption: "warn" | "fatal";
    optionError: (message: string, _key: string) => void;
};
export declare class Expandable {
}
export declare function expandable(def: OptionList): any;
export declare function makeArray(x: any): any[];
export declare function keys(def: OptionList): (string | symbol)[];
export declare function copy(def: OptionList): OptionList;
export declare function insert(dst: OptionList, src: OptionList, warn?: boolean): OptionList;
export declare function defaultOptions(options: OptionList, ...defs: OptionList[]): OptionList;
export declare function userOptions(options: OptionList, ...defs: OptionList[]): OptionList;
export declare function selectOptions(options: OptionList, ...keys: string[]): OptionList;
export declare function selectOptionsFromKeys(options: OptionList, object: OptionList): OptionList;
export declare function separateOptions(options: OptionList, ...objects: OptionList[]): OptionList[];
export declare function lookup(name: string, lookup: OptionList, def?: any): any;
