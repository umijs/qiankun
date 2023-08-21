import * as Babel from '@umijs/bundler-utils/compiled/babel/core';
import * as t from '@umijs/bundler-utils/compiled/babel/types';
export interface IOpts {
    onTransformDeps?: Function;
    onCollect?: Function;
    exportAllMembers?: Record<string, string[]>;
    unMatchLibs?: Array<string | RegExp>;
    remoteName?: string;
    alias?: Record<string, string>;
    externals?: any;
}
export default function (): {
    pre(): void;
    post(state: any): void;
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
