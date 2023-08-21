import * as Babel from '@umijs/bundler-utils/compiled/babel/core';
import * as t from '@umijs/bundler-utils/compiled/babel/types';
export interface IOpts {
    resolveImportSource: (importSource: string) => string;
    exportAllMembers?: Record<string, string[]>;
    unMatchLibs?: string[];
    remoteName?: string;
    alias?: Record<string, string>;
    externals?: any;
}
export default function (): {
    visitor: {
        Program: {
            exit(path: Babel.NodePath<t.Program>, { opts }: {
                opts: IOpts;
            }): void;
        };
        CallExpression: {
            exit(path: Babel.NodePath<t.CallExpression>, { opts }: {
                opts: IOpts;
            }): void;
        };
    };
};
