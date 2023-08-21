import { AbstractVariableItem } from './abstract_variable_item.js';
import { Menu } from './menu.js';
import { ParserFactory } from './parser_factory.js';
export declare class Combo extends AbstractVariableItem<string> {
    protected role: string;
    private input;
    private inputEvent;
    static fromJson(_factory: ParserFactory, { content: content, variable: variable, id: id }: {
        content: string;
        variable: string;
        id: string;
    }, menu: Menu): Combo;
    constructor(menu: Menu, content: string, variable: string, id?: string);
    executeAction(): void;
    space(event: KeyboardEvent): void;
    focus(): void;
    unfocus(): void;
    generateHtml(): void;
    generateSpan(): void;
    inputKey(_event: KeyboardEvent): void;
    keydown(event: KeyboardEvent): void;
    protected updateAria(): void;
    protected updateSpan(): void;
    toJson(): {
        type: string;
    };
}
