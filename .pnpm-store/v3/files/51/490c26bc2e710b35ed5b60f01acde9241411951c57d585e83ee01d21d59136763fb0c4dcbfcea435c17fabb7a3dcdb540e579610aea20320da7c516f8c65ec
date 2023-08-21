import { ColorPicker, StringColor } from './color_picker';
import { Highlighter } from './highlighter';
export interface Highlight {
    node: HTMLElement;
    opacity?: string;
    background?: string;
    foreground?: string;
    box?: HTMLElement;
    position?: string;
}
export declare abstract class AbstractHighlighter implements Highlighter {
    protected static ATTR: string;
    protected color: ColorPicker;
    protected mactionName: string;
    private currentHighlights;
    protected abstract highlightNode(node: HTMLElement): Highlight;
    protected abstract unhighlightNode(highlight: Highlight): void;
    highlight(nodes: HTMLElement[]): void;
    highlightAll(node: HTMLElement): void;
    unhighlight(): void;
    unhighlightAll(): void;
    setColor(color: ColorPicker): void;
    colorString(): StringColor;
    addEvents(node: HTMLElement, events: {
        [key: string]: EventListener;
    }): void;
    getMactionNodes(node: HTMLElement): HTMLElement[];
    isMactionNode(node: Element): boolean;
    isHighlighted(node: HTMLElement): boolean;
    setHighlighted(node: HTMLElement): void;
    unsetHighlighted(node: HTMLElement): void;
    colorizeAll(node: HTMLElement): void;
    uncolorizeAll(node: HTMLElement): void;
    colorize(node: HTMLElement): void;
    uncolorize(node: HTMLElement): void;
}
