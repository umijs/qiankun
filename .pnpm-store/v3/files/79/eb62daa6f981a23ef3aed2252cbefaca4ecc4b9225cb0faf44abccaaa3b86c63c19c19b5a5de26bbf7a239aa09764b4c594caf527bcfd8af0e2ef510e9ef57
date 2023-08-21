import { MathDocument } from '../../core/MathDocument.js';
import { CssStyles } from '../../util/StyleList.js';
import Sre from '../sre.js';
export declare type A11yDocument = MathDocument<HTMLElement, Text, Document>;
export interface Region<T> {
    AddStyles(): void;
    AddElement(): void;
    Show(node: HTMLElement, highlighter: Sre.highlighter): void;
    Hide(): void;
    Clear(): void;
    Update(content: T): void;
}
export declare abstract class AbstractRegion<T> implements Region<T> {
    document: A11yDocument;
    protected static className: string;
    protected static styleAdded: boolean;
    protected static style: CssStyles;
    protected div: HTMLElement;
    protected inner: HTMLElement;
    protected CLASS: typeof AbstractRegion;
    constructor(document: A11yDocument);
    AddStyles(): void;
    AddElement(): void;
    Show(node: HTMLElement, highlighter: Sre.highlighter): void;
    protected abstract position(node: HTMLElement): void;
    protected abstract highlight(highlighter: Sre.highlighter): void;
    Hide(): void;
    abstract Clear(): void;
    abstract Update(content: T): void;
    protected stackRegions(node: HTMLElement): void;
}
export declare class DummyRegion extends AbstractRegion<void> {
    Clear(): void;
    Update(): void;
    Hide(): void;
    Show(): void;
    AddElement(): void;
    AddStyles(): void;
    position(): void;
    highlight(_highlighter: Sre.highlighter): void;
}
export declare class StringRegion extends AbstractRegion<string> {
    Clear(): void;
    Update(speech: string): void;
    protected position(node: HTMLElement): void;
    protected highlight(highlighter: Sre.highlighter): void;
}
export declare class ToolTip extends StringRegion {
    protected static className: string;
    protected static style: CssStyles;
}
export declare class LiveRegion extends StringRegion {
    document: A11yDocument;
    protected static className: string;
    protected static style: CssStyles;
    constructor(document: A11yDocument);
}
export declare class HoverRegion extends AbstractRegion<HTMLElement> {
    document: A11yDocument;
    protected static className: string;
    protected static style: CssStyles;
    constructor(document: A11yDocument);
    protected position(node: HTMLElement): void;
    protected highlight(highlighter: Sre.highlighter): void;
    Show(node: HTMLElement, highlighter: Sre.highlighter): void;
    Clear(): void;
    Update(node: HTMLElement): void;
    private cloneNode;
}
