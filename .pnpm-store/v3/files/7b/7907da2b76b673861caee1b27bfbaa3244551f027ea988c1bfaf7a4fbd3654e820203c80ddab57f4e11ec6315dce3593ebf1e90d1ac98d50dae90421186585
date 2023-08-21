import { PropertyList, Property } from '../Tree/Node.js';
export declare const INHERIT = "_inherit_";
export declare class Attributes {
    protected attributes: PropertyList;
    protected inherited: PropertyList;
    protected defaults: PropertyList;
    protected global: PropertyList;
    constructor(defaults: PropertyList, global: PropertyList);
    set(name: string, value: Property): void;
    setList(list: PropertyList): void;
    get(name: string): Property;
    getExplicit(name: string): Property;
    getList(...names: string[]): PropertyList;
    setInherited(name: string, value: Property): void;
    getInherited(name: string): Property;
    getDefault(name: string): Property;
    isSet(name: string): boolean;
    hasDefault(name: string): boolean;
    getExplicitNames(): string[];
    getInheritedNames(): string[];
    getDefaultNames(): string[];
    getGlobalNames(): string[];
    getAllAttributes(): PropertyList;
    getAllInherited(): PropertyList;
    getAllDefaults(): PropertyList;
    getAllGlobals(): PropertyList;
}
