import { AbstractMenu } from './abstract_menu.js';
import { Submenu } from './item_submenu.js';
import { ParserFactory } from './parser_factory.js';
export declare class SubMenu extends AbstractMenu {
    private _anchor;
    static fromJson(factory: ParserFactory, { items: its }: {
        items: any[];
        id: string;
    }, anchor: Submenu): SubMenu;
    constructor(_anchor: Submenu);
    get anchor(): Submenu;
    post(): void;
    protected display(): void;
    private setBaseMenu;
    left(_event: KeyboardEvent): void;
    toJson(): {
        type: string;
    };
}
