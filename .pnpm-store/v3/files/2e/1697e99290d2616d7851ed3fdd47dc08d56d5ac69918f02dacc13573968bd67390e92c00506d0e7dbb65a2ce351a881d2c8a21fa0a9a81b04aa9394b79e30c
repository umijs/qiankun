import { AbstractEntry } from './abstract_entry.js';
import { Menu } from './menu.js';
import { ParserFactory } from './parser_factory.js';
export declare class Rule extends AbstractEntry {
    protected className: import("./html_classes.js").HtmlClass;
    protected role: string;
    static fromJson(_factory: ParserFactory, {}: {}, menu: Menu): Rule;
    constructor(menu: Menu);
    generateHtml(): void;
    addEvents(_element: HTMLElement): void;
    toJson(): {
        type: string;
    };
}
