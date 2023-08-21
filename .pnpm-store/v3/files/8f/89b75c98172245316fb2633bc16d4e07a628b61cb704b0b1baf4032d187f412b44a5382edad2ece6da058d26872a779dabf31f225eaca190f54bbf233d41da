import { AbstractVariableItem } from './abstract_variable_item.js';
import { Menu } from './menu.js';
import { ParserFactory } from './parser_factory.js';
export declare class Checkbox extends AbstractVariableItem<boolean> {
    protected role: string;
    static fromJson(_factory: ParserFactory, { content: content, variable: variable, id: id }: {
        content: string;
        variable: string;
        id: string;
    }, menu: Menu): Checkbox;
    constructor(menu: Menu, content: string, variable: string, id?: string);
    executeAction(): void;
    generateSpan(): void;
    protected updateAria(): void;
    updateSpan(): void;
    toJson(): {
        type: string;
    };
}
