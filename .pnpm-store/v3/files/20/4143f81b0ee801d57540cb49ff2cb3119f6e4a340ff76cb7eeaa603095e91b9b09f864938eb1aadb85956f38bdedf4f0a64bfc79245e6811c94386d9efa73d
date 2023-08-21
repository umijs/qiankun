import { ContextMenu } from './context_menu.js';
import { AbstractMenu } from './abstract_menu.js';
import { Info } from './info.js';
import { ParserFactory } from './parser_factory.js';
declare type selection = {
    title: string;
    values: string[];
    variable: string;
};
export declare class SelectionMenu extends AbstractMenu {
    anchor: SelectionBox;
    protected className: import("./html_classes.js").HtmlClass;
    static fromJson(factory: ParserFactory, { title: title, values: values, variable: variable }: selection, sb: SelectionBox): SelectionMenu;
    constructor(anchor: SelectionBox);
    generateHtml(): void;
    protected display(): void;
    right(event: KeyboardEvent): void;
    left(event: KeyboardEvent): void;
}
export declare const enum SelectionOrder {
    NONE = "none",
    ALPHABETICAL = "alphabetical",
    INCREASING = "increasing",
    DECREASING = "decreasing"
}
export declare const enum SelectionGrid {
    SQUARE = "square",
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal"
}
export declare class SelectionBox extends Info {
    style: SelectionOrder;
    grid: SelectionGrid;
    private _selections;
    private prefix;
    private _balanced;
    static chunkSize: number;
    static fromJson(factory: ParserFactory, { title: title, signature: signature, selections: selections, order: order, grid: grid }: {
        title: string;
        signature: string;
        selections: selection[];
        order?: SelectionOrder;
        grid?: SelectionGrid;
    }, ctxt: ContextMenu): SelectionBox;
    constructor(title: string, signature: string, style?: SelectionOrder, grid?: SelectionGrid);
    attachMenu(menu: ContextMenu): void;
    get selections(): SelectionMenu[];
    set selections(selections: SelectionMenu[]);
    addSelection(selection: SelectionMenu): void;
    private rowDiv;
    protected display(): void;
    private getChunkSize;
    private balanceColumn;
    private combineColumn;
    left(event: KeyboardEvent): void;
    right(event: KeyboardEvent): void;
    generateHtml(): void;
    protected generateContent(): HTMLElement;
    private findSelection;
    private move;
    static orderMethod: Map<SelectionOrder, (x: SelectionMenu, y: SelectionMenu) => number>;
    private order;
    toJson(): {
        type: string;
    };
}
export {};
