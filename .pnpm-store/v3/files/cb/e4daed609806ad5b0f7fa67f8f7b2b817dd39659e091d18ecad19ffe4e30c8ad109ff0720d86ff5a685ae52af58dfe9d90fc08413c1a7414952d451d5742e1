import { HTMLAdaptor } from './HTMLAdaptor.js';
import { Constructor } from './NodeMixin.js';
import { OptionList } from '../util/Options.js';
export declare type HTMLAdaptorConstructor = Constructor<HTMLAdaptor<HTMLElement, Text, Document>>;
declare const LinkedomAdaptor_base: HTMLAdaptorConstructor;
export declare class LinkedomAdaptor extends LinkedomAdaptor_base {
    parse(text: string, format?: string): Document;
    serializeXML(node: HTMLElement): string;
}
export declare function linkedomAdaptor(parseHTML: any, options?: OptionList): LinkedomAdaptor;
export {};
