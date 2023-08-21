import { Entry } from './entry.js';
import { MenuElement } from './menu_element.js';
import { Menu } from './menu.js';
export declare abstract class AbstractEntry extends MenuElement implements Entry {
    private _menu;
    private _type;
    protected className: import("./html_classes.js").HtmlClass;
    protected role: string;
    private hidden;
    constructor(_menu: Menu, _type: string);
    get menu(): Menu;
    set menu(menu: Menu);
    get type(): string;
    hide(): void;
    show(): void;
    isHidden(): boolean;
}
