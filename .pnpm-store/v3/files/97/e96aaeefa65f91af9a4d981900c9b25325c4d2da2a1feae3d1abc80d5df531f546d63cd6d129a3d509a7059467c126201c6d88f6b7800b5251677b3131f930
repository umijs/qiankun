import { PrioritizedList } from '../util/PrioritizedList.js';
import { OptionList } from '../util/Options.js';
import { Handler } from './Handler.js';
import { MathDocument } from './MathDocument.js';
export declare class HandlerList<N, T, D> extends PrioritizedList<Handler<N, T, D>> {
    register(handler: Handler<N, T, D>): Handler<N, T, D>;
    unregister(handler: Handler<N, T, D>): void;
    handlesDocument(document: any): Handler<N, T, D>;
    document(document: any, options?: OptionList): MathDocument<N, T, D>;
}
