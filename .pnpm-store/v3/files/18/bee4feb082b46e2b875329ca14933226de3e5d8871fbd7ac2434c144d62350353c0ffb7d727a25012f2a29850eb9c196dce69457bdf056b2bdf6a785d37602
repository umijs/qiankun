import { AbstractItem } from './abstract_item.js';
import { Menu } from './menu.js';
import { ParserFactory } from './parser_factory.js';
export declare class Command extends AbstractItem {
    private command;
    static fromJson(_factory: ParserFactory, { content: content, action: action, id: id }: {
        content: string;
        action: Function;
        id: string;
    }, menu: Menu): Command;
    constructor(menu: Menu, content: string, command: Function, id?: string);
    executeAction(): void;
    toJson(): {
        type: string;
    };
}
