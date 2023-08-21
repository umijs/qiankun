import { MmlFactory } from '../../core/MmlTree/MmlFactory.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { OptionList } from '../../util/Options.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
export declare class MathMLCompile<N, T, D> {
    static OPTIONS: OptionList;
    adaptor: DOMAdaptor<N, T, D>;
    protected factory: MmlFactory;
    protected options: OptionList;
    constructor(options?: OptionList);
    setMmlFactory(mmlFactory: MmlFactory): void;
    compile(node: N): MmlNode;
    makeNode(node: N): MmlNode;
    protected addAttributes(mml: MmlNode, node: N): void;
    protected filterAttribute(_name: string, value: string): string;
    protected filterClassList(list: string[]): string[];
    protected addChildren(mml: MmlNode, node: N): void;
    protected addText(mml: MmlNode, child: N): void;
    protected checkClass(mml: MmlNode, node: N): void;
    protected fixCalligraphic(variant: string): string;
    protected markMrows(mml: MmlNode): void;
    protected trimSpace(text: string): string;
    protected error(message: string): void;
}
