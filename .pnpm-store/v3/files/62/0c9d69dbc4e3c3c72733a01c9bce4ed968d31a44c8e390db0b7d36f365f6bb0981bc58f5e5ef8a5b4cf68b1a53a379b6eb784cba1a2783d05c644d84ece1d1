import { ColorPicker, StringColor } from './color_picker';
export interface Highlighter {
    highlight(nodes: HTMLElement[]): void;
    unhighlight(): void;
    highlightAll(node: HTMLElement): void;
    unhighlightAll(): void;
    isMactionNode(node: Element): boolean;
    setColor(color: ColorPicker): void;
    colorString(): StringColor;
    addEvents(node: HTMLElement, events: {
        [key: string]: EventListener;
    }): void;
}
