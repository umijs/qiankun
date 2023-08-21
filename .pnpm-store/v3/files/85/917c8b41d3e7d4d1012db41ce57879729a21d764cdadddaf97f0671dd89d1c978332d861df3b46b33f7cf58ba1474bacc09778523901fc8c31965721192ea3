import { AbstractMenu } from './abstract_menu.js';
import { MenuStore } from './menu_store.js';
import { Postable } from './postable.js';
import { ParserFactory } from './parser_factory.js';
export declare class ContextMenu extends AbstractMenu {
    factory: ParserFactory;
    id: string;
    private moving;
    private _frame;
    private _store;
    private anchor;
    private widgets;
    static fromJson(factory: ParserFactory, { pool: pool, items: items, id: id }: {
        pool: Array<Object>;
        items: Array<Object>;
        id: string;
    }): ContextMenu;
    constructor(factory: ParserFactory);
    generateHtml(): void;
    protected display(): void;
    escape(_event: KeyboardEvent): void;
    unpost(): void;
    left(_event: KeyboardEvent): void;
    right(_event: KeyboardEvent): void;
    get frame(): HTMLElement;
    get store(): MenuStore;
    post(): void;
    post(x: number, y: number): void;
    post(event: Event): void;
    post(element: HTMLElement): void;
    registerWidget(widget: Postable): void;
    unregisterWidget(widget: Postable): void;
    unpostWidgets(): void;
    toJson(): {
        type: string;
    };
    private move_;
}
