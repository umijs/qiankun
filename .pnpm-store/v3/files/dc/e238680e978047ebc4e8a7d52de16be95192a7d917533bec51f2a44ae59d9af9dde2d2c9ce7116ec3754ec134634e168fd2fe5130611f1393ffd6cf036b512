import { AbstractItem } from './abstract_item.js';
import { Menu } from './menu.js';
import { ParserFactory } from './parser_factory.js';
export declare class Submenu extends AbstractItem {
    private span;
    private _submenu;
    static fromJson(factory: ParserFactory, { content: content, menu: submenu, id: id }: {
        content: string;
        menu: any;
        id: string;
    }, menu: Menu): Submenu;
    constructor(menu: Menu, content: string, id?: string);
    set submenu(menu: Menu);
    get submenu(): Menu;
    mouseover(event: MouseEvent): void;
    mouseout(event: MouseEvent): void;
    unfocus(): void;
    focus(): void;
    executeAction(): void;
    generateHtml(): void;
    left(event: KeyboardEvent): void;
    right(event: KeyboardEvent): void;
    toJson(): {
        type: string;
    };
}
