import { AbstractItem } from './abstract_item.js';
import { Menu } from './menu.js';
import { ParserFactory } from './parser_factory.js';
export declare class Label extends AbstractItem {
    static fromJson(_factory: ParserFactory, { content: content, id: id }: {
        content: string;
        id: string;
    }, menu: Menu): Label;
    constructor(menu: Menu, content: string, id?: string);
    generateHtml(): void;
    toJson(): {
        type: string;
    };
}
