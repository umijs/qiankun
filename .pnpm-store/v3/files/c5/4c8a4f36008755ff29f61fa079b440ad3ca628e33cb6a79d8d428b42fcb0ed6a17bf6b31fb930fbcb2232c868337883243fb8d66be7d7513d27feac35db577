import visit from 'unist-util-visit';
import type { IDumiUnifiedTransformer, IDumiElmNode } from '.';
import type { Transformer } from 'unified';
import type unified from 'unified';
type ICompiler = (this: Pick<unified.Processor<unified.Settings>, 'data'>, node: Parameters<visit.Visitor<IDumiElmNode>>[0], index: Parameters<visit.Visitor<IDumiElmNode>>[1], parent: Parameters<visit.Visitor<IDumiElmNode>>[2], vFile: Parameters<Transformer>[1]) => ReturnType<visit.Visitor<IDumiElmNode>>;
export interface IMarkdwonComponent {
    /**
     * The markdown component name which should always start with a capital letter
     */
    name: string;
    /**
     * The component path
     */
    component: string;
    /**
     * The compiler function about how to parse the HTML Abstract Syntax Tree parsed by rehype
     * @see https://github.com/syntax-tree/hast for more details about the HTML Abstract Syntax Tree
     * @see https://github.com/syntax-tree/unist-util-visit-parents#returns for more details about the return value for this function
     */
    compiler: ICompiler;
}
export declare function registerMdComponent(comp: IMarkdwonComponent): void;
/**
 * remark plugin for parsing the customize markdwon components
 */
export default function mdComponent(): IDumiUnifiedTransformer;
export {};
