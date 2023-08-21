import { KeyNavigatable } from './key_navigatable.js';
import { MouseNavigatable } from './mouse_navigatable.js';
export declare abstract class AbstractNavigatable implements KeyNavigatable, MouseNavigatable {
    private bubble;
    bubbleKey(): void;
    keydown(event: KeyboardEvent): void;
    escape(_event: KeyboardEvent): void;
    space(_event: KeyboardEvent): void;
    left(_event: KeyboardEvent): void;
    right(_event: KeyboardEvent): void;
    up(_event: KeyboardEvent): void;
    down(_event: KeyboardEvent): void;
    protected stop(event: Event): void;
    mousedown(event: MouseEvent): void;
    mouseup(event: MouseEvent): void;
    mouseover(event: MouseEvent): void;
    mouseout(event: MouseEvent): void;
    click(event: MouseEvent): void;
    addEvents(element: HTMLElement): void;
}
