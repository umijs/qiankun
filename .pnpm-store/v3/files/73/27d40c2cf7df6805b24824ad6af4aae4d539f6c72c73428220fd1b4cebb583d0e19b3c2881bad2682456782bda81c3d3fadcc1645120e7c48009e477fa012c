import { MathDocumentConstructor } from '../../core/MathDocument.js';
import { Handler } from '../../core/Handler.js';
import { ComplexityMathDocument, ComplexityMathItem } from '../../a11y/complexity.js';
import { ExplorerMathDocument, ExplorerMathItem } from '../../a11y/explorer.js';
import { AssistiveMmlMathDocument, AssistiveMmlMathItem } from '../../a11y/assistive-mml.js';
import { Menu } from './Menu.js';
export declare type Constructor<T> = new (...args: any[]) => T;
export declare type A11yMathItemConstructor = {
    new (...args: any[]): ComplexityMathItem<HTMLElement, Text, Document> & ExplorerMathItem & AssistiveMmlMathItem<HTMLElement, Text, Document>;
};
export declare type A11yDocumentConstructor = MathDocumentConstructor<ComplexityMathDocument<HTMLElement, Text, Document> & ExplorerMathDocument & AssistiveMmlMathDocument<HTMLElement, Text, Document>>;
export interface MenuMathItem extends ComplexityMathItem<HTMLElement, Text, Document> {
    addMenu(document: MenuMathDocument, force?: boolean): void;
    checkLoading(document: MenuMathDocument): void;
}
export declare function MenuMathItemMixin<B extends A11yMathItemConstructor>(BaseMathItem: B): Constructor<MenuMathItem> & B;
export interface MenuMathDocument extends ComplexityMathDocument<HTMLElement, Text, Document> {
    menu: Menu;
    addMenu(): MenuMathDocument;
    checkLoading(): MenuMathDocument;
}
export declare function MenuMathDocumentMixin<B extends A11yDocumentConstructor>(BaseDocument: B): Constructor<MenuMathDocument> & B;
export declare function MenuHandler(handler: Handler<HTMLElement, Text, Document>): Handler<HTMLElement, Text, Document>;
