import { AbstractHandler } from '../../core/Handler.js';
import { MinHTMLAdaptor } from '../../adaptors/HTMLAdaptor.js';
import { HTMLDocument } from './HTMLDocument.js';
import { OptionList } from '../../util/Options.js';
export declare class HTMLHandler<N, T, D> extends AbstractHandler<N, T, D> {
    adaptor: MinHTMLAdaptor<N, T, D>;
    documentClass: typeof HTMLDocument;
    handlesDocument(document: any): boolean;
    create(document: any, options: OptionList): HTMLDocument<N, T, D>;
}
