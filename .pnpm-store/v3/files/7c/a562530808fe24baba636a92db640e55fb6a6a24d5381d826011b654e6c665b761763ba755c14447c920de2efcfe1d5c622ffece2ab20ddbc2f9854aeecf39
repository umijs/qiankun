import { AbstractNavigatable } from './abstract_navigatable.js';
import { HtmlClass } from './html_classes.js';
import { Element } from './element.js';
export declare abstract class MenuElement extends AbstractNavigatable implements Element {
    protected role: string;
    protected className: HtmlClass;
    private _html;
    addAttributes(attributes: {
        [attr: string]: string;
    }): void;
    get html(): HTMLElement;
    set html(html: HTMLElement);
    generateHtml(): void;
    focus(): void;
    unfocus(): void;
}
