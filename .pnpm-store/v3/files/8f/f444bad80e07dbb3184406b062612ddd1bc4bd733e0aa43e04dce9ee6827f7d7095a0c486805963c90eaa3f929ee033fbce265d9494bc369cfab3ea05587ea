import { ContextMenu } from './context_menu.js';
import { AbstractPostable } from './abstract_postable.js';
export declare class Info extends AbstractPostable {
    private title;
    private signature;
    protected className: import("./html_classes.js").HtmlClass;
    protected role: string;
    protected contentDiv: HTMLElement;
    menu: ContextMenu;
    private close;
    private content;
    constructor(title: string, content: Function, signature: string);
    attachMenu(menu: ContextMenu): void;
    generateHtml(): void;
    post(): void;
    protected display(): void;
    click(_event: MouseEvent): void;
    keydown(event: KeyboardEvent): void;
    escape(_event: KeyboardEvent): void;
    unpost(): void;
    private generateClose;
    private generateTitle;
    protected generateContent(): HTMLElement;
    private generateSignature;
    toJson(): {
        type: string;
    };
}
