import { ContextMenu } from './context_menu.js';
import { AbstractPostable } from './abstract_postable.js';
export declare class Popup extends AbstractPostable {
    private title;
    private static popupSettings;
    private menu;
    private content;
    private window;
    private localSettings;
    private windowList;
    private mobileFlag;
    private active;
    static fromJson(): void;
    constructor(title: string, content: Function);
    attachMenu(menu: ContextMenu): void;
    post(): void;
    protected display(): void;
    unpost(): void;
    private generateContent;
    private resize;
    toJson(): {
        type: string;
    };
}
