import { TSESTree } from '@typescript-eslint/typescript-estree';
import { Scope } from './Scope';
import { Variable } from './Variable';
interface Reference {
    identifier: TSESTree.Identifier;
    from: Scope;
    resolved: Variable | null;
    writeExpr: TSESTree.Node | null;
    init: boolean;
    isWrite(): boolean;
    isRead(): boolean;
    isWriteOnly(): boolean;
    isReadOnly(): boolean;
    isReadWrite(): boolean;
}
declare const Reference: {
    new (): Reference;
    READ: 1;
    WRITE: 2;
    RW: 3;
};
export { Reference };
//# sourceMappingURL=Reference.d.ts.map