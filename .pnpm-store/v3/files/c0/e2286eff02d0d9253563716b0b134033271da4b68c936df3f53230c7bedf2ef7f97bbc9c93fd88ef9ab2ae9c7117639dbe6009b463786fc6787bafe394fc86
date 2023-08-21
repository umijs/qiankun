import { AbstractInputJax } from '../core/InputJax.js';
import { OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { MmlFactory } from '../core/MmlTree/MmlFactory.js';
import { FindTeX } from './tex/FindTeX.js';
import TexError from './tex/TexError.js';
import ParseOptions from './tex/ParseOptions.js';
import { ParserConfiguration } from './tex/Configuration.js';
import './tex/base/BaseConfiguration.js';
export declare class TeX<N, T, D> extends AbstractInputJax<N, T, D> {
    static NAME: string;
    static OPTIONS: OptionList;
    protected findTeX: FindTeX<N, T, D>;
    protected configuration: ParserConfiguration;
    protected latex: string;
    protected mathNode: MmlNode;
    private _parseOptions;
    protected static configure(packages: (string | [string, number])[]): ParserConfiguration;
    protected static tags(options: ParseOptions, configuration: ParserConfiguration): void;
    constructor(options?: OptionList);
    setMmlFactory(mmlFactory: MmlFactory): void;
    get parseOptions(): ParseOptions;
    reset(tag?: number): void;
    compile(math: MathItem<N, T, D>, document: MathDocument<N, T, D>): MmlNode;
    findMath(strings: string[]): import("../core/MathItem.js").ProtoItem<N, T>[];
    formatError(err: TexError): MmlNode;
}
