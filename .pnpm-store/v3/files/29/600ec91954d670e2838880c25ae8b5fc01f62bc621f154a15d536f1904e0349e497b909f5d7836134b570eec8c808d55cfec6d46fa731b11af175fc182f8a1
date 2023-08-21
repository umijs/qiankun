import { A11yDocument, Region } from './Region.js';
import { Explorer, AbstractExplorer } from './Explorer.js';
export interface TreeExplorer extends Explorer {
}
export declare class AbstractTreeExplorer extends AbstractExplorer<void> {
    document: A11yDocument;
    protected region: Region<void>;
    protected node: HTMLElement;
    protected mml: HTMLElement;
    protected constructor(document: A11yDocument, region: Region<void>, node: HTMLElement, mml: HTMLElement);
    readonly stoppable = false;
    Attach(): void;
    Detach(): void;
}
export declare class FlameColorer extends AbstractTreeExplorer {
    Start(): void;
    Stop(): void;
}
export declare class TreeColorer extends AbstractTreeExplorer {
    Start(): void;
    Stop(): void;
}
