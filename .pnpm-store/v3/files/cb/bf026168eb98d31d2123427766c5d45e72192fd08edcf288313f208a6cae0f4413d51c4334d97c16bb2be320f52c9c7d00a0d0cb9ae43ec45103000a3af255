import { CommonOutputJax } from './common/OutputJax.js';
import { CommonWrapper } from './common/Wrapper.js';
import { StyleList as CssStyleList, CssStyles } from '../util/StyleList.js';
import { OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { CHTMLWrapper } from './chtml/Wrapper.js';
import { CHTMLWrapperFactory } from './chtml/WrapperFactory.js';
import { CHTMLFontData } from './chtml/FontData.js';
import { Usage } from './chtml/Usage.js';
export declare class CHTML<N, T, D> extends CommonOutputJax<N, T, D, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLFontData, typeof CHTMLFontData> {
    static NAME: string;
    static OPTIONS: OptionList;
    static commonStyles: CssStyleList;
    static STYLESHEETID: string;
    factory: CHTMLWrapperFactory<N, T, D>;
    wrapperUsage: Usage<string>;
    chtmlStyles: N;
    constructor(options?: OptionList);
    escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>): N;
    styleSheet(html: MathDocument<N, T, D>): N;
    protected updateFontStyles(styles: CssStyles): void;
    protected addWrapperStyles(styles: CssStyles): void;
    protected addClassStyles(wrapper: typeof CommonWrapper, styles: CssStyles): void;
    protected processMath(math: MmlNode, parent: N): void;
    clearCache(): void;
    reset(): void;
    unknownText(text: string, variant: string, width?: number): N;
    measureTextNode(textNode: N): {
        w: number;
        h: number;
        d: number;
    };
}
