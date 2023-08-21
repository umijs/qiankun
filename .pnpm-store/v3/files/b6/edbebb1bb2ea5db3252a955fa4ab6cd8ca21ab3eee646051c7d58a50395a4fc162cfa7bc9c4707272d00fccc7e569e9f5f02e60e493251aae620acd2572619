import { Property } from '../../core/Tree/Node.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { MathItem } from '../../core/MathItem.js';
import { MathDocument } from '../../core/MathDocument.js';
import { OptionList } from '../../util/Options.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
export declare type FilterFunction<N, T, D> = (safe: Safe<N, T, D>, value: Property, ...args: any[]) => Property;
export declare class Safe<N, T, D> {
    static OPTIONS: OptionList;
    filterAttributes: Map<string, string>;
    options: OptionList;
    allow: OptionList;
    adaptor: DOMAdaptor<N, T, D>;
    filterMethods: {
        [name: string]: FilterFunction<N, T, D>;
    };
    constructor(document: MathDocument<N, T, D>, options: OptionList);
    sanitize(math: MathItem<N, T, D>, document: MathDocument<N, T, D>): void;
    protected sanitizeNode(node: MmlNode): void;
    mmlAttribute(id: string, value: string): string | null;
    mmlClassList(list: string[]): string[];
}
