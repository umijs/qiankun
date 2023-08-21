import { A11yDocument, Region } from './Region.js';
import { Explorer, AbstractExplorer } from './Explorer.js';
import '../sre.js';
export interface MouseExplorer extends Explorer {
    MouseOver(event: MouseEvent): void;
    MouseOut(event: MouseEvent): void;
}
export declare abstract class AbstractMouseExplorer<T> extends AbstractExplorer<T> implements MouseExplorer {
    protected events: [string, (x: Event) => void][];
    MouseOver(_event: MouseEvent): void;
    MouseOut(_event: MouseEvent): void;
}
export declare abstract class Hoverer<T> extends AbstractMouseExplorer<T> {
    document: A11yDocument;
    protected region: Region<T>;
    protected node: HTMLElement;
    protected nodeQuery: (node: HTMLElement) => boolean;
    protected nodeAccess: (node: HTMLElement) => T;
    protected coord: [number, number];
    protected constructor(document: A11yDocument, region: Region<T>, node: HTMLElement, nodeQuery: (node: HTMLElement) => boolean, nodeAccess: (node: HTMLElement) => T);
    MouseOut(event: MouseEvent): void;
    MouseOver(event: MouseEvent): void;
    getNode(node: HTMLElement): [HTMLElement, T];
}
export declare class ValueHoverer extends Hoverer<string> {
}
export declare class ContentHoverer extends Hoverer<HTMLElement> {
}
export declare class FlameHoverer extends Hoverer<void> {
    document: A11yDocument;
    protected node: HTMLElement;
    protected constructor(document: A11yDocument, _ignore: any, node: HTMLElement);
}
