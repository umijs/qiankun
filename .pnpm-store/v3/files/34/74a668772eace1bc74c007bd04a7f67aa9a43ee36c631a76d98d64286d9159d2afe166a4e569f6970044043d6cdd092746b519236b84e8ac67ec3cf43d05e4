import { AbstractItem } from './abstract_item.js';
import { VariableItem } from './variable_item.js';
import { Variable } from './variable.js';
export declare abstract class AbstractVariableItem<T> extends AbstractItem implements VariableItem {
    protected span: HTMLElement;
    protected variable: Variable<T>;
    protected abstract generateSpan(): void;
    generateHtml(): void;
    register(): void;
    unregister(): void;
    update(): void;
    protected abstract updateAria(): void;
    protected abstract updateSpan(): void;
}
