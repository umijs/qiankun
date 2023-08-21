import { A11yDocument, Region } from './Region.js';
import Sre from '../sre.js';
export interface Explorer {
    active: boolean;
    stoppable: boolean;
    Attach(): void;
    Detach(): void;
    Start(): void;
    Stop(): void;
    AddEvents(): void;
    RemoveEvents(): void;
    Update(force?: boolean): void;
}
export declare class AbstractExplorer<T> implements Explorer {
    document: A11yDocument;
    protected region: Region<T>;
    protected node: HTMLElement;
    stoppable: boolean;
    protected events: [string, (x: Event) => void][];
    protected highlighter: Sre.highlighter;
    private _active;
    protected static stopEvent(event: Event): void;
    static create<T>(document: A11yDocument, region: Region<T>, node: HTMLElement, ...rest: any[]): Explorer;
    protected constructor(document: A11yDocument, region: Region<T>, node: HTMLElement, ..._rest: any[]);
    protected Events(): [string, (x: Event) => void][];
    get active(): boolean;
    set active(flag: boolean);
    Attach(): void;
    Detach(): void;
    Start(): void;
    Stop(): void;
    AddEvents(): void;
    RemoveEvents(): void;
    Update(force?: boolean): void;
    protected getHighlighter(): Sre.highlighter;
    protected stopEvent(event: Event): void;
}
