import { AbstractVariableItem } from './abstract_variable_item.js';
import { Menu } from './menu.js';
import { ParserFactory } from './parser_factory.js';
export declare class Slider extends AbstractVariableItem<string> {
    protected role: string;
    private labelSpan;
    private valueSpan;
    private labelId;
    private valueId;
    private input;
    private inputEvent;
    static fromJson(_factory: ParserFactory, { content: content, variable: variable, id: id }: {
        content: string;
        variable: string;
        id: string;
    }, menu: Menu): Slider;
    constructor(menu: Menu, content: string, variable: string, id?: string);
    executeAction(): void;
    space(event: KeyboardEvent): void;
    focus(): void;
    unfocus(): void;
    generateHtml(): void;
    generateSpan(): void;
    inputKey(_event: KeyboardEvent): void;
    mousedown(event: MouseEvent): void;
    mouseup(_event: MouseEvent): void;
    keydown(event: KeyboardEvent): void;
    protected updateAria(): void;
    protected updateSpan(): void;
    toJson(): {
        type: string;
    };
}
