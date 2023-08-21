import { AbstractPostable } from './abstract_postable.js';
import { Menu } from './menu.js';
import { Item } from './item.js';
import { VariablePool } from './variable_pool.js';
export declare abstract class AbstractMenu extends AbstractPostable implements Menu {
    protected className: import("./html_classes.js").HtmlClass;
    protected variablePool: VariablePool<string | boolean>;
    protected role: string;
    protected _items: Item[];
    private _baseMenu;
    private _focused;
    set baseMenu(menu: Menu);
    get baseMenu(): Menu;
    get items(): Item[];
    set items(items: Item[]);
    get pool(): VariablePool<string | boolean>;
    get focused(): Item;
    set focused(item: Item);
    up(_event: KeyboardEvent): void;
    down(_event: KeyboardEvent): void;
    generateHtml(): void;
    generateMenu(): void;
    post(x?: number, y?: number): void;
    unpostSubmenus(): void;
    unpost(): void;
    find(id: string): Item;
}
