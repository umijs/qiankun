import { OptionList } from '../../util/Options.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
export declare type HTMLNodeList<N, T> = [N | T, number][];
export declare class HTMLDomStrings<N, T, D> {
    static OPTIONS: OptionList;
    protected options: OptionList;
    protected strings: string[];
    protected string: string;
    protected snodes: HTMLNodeList<N, T>;
    protected nodes: HTMLNodeList<N, T>[];
    protected stack: [N | T, boolean][];
    protected skipHtmlTags: RegExp;
    protected ignoreHtmlClass: RegExp;
    protected processHtmlClass: RegExp;
    adaptor: DOMAdaptor<N, T, D>;
    constructor(options?: OptionList);
    protected init(): void;
    protected getPatterns(): void;
    protected pushString(): void;
    protected extendString(node: N | T, text: string): void;
    protected handleText(node: T, ignore: boolean): N | T;
    protected handleTag(node: N, ignore: boolean): N | T;
    protected handleContainer(node: N, ignore: boolean): [N | T, boolean];
    protected handleOther(node: N, _ignore: boolean): N | T;
    find(node: N | T): [string[], HTMLNodeList<N, T>[]];
}
