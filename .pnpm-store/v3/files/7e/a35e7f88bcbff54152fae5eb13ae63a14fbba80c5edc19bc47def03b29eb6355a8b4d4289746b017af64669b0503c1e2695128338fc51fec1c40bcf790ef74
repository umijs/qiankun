import { MathItem } from '../../core/MathItem.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { SelectableInfo } from './SelectableInfo.js';
import { ContextMenu } from 'mj-context-menu/js/context_menu.js';
import { SubMenu } from 'mj-context-menu/js/sub_menu.js';
import { Submenu } from 'mj-context-menu/js/item_submenu.js';
import { Item } from 'mj-context-menu/js/item.js';
export declare class MJContextMenu extends ContextMenu {
    static DynamicSubmenus: Map<string, (menu: MJContextMenu, sub: Submenu) => SubMenu>;
    mathItem: MathItem<HTMLElement, Text, Document>;
    annotation: string;
    showAnnotation: SelectableInfo;
    copyAnnotation: () => void;
    annotationTypes: {
        [type: string]: string[];
    };
    post(x?: any, y?: number): void;
    unpost(): void;
    findID(...names: string[]): Item;
    protected getAnnotationMenu(): void;
    protected getSemanticNode(): MmlNode | null;
    protected getAnnotations(node: MmlNode): [string, string][];
    protected annotationMatch(child: MmlNode): string | null;
    protected createAnnotationMenu(id: string, annotations: [string, string][], action: () => void): void;
    dynamicSubmenus(): void;
}
