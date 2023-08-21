import type { ImportSpecifier } from '@umijs/bundler-utils/compiled/es-module-lexer';
import type { Match } from '../staticDepInfo';
export default function createHandle(importOptions: {
    libraryName: string;
    libraryDirectory: string;
    style: boolean | string;
    camel2UnderlineComponentName?: boolean;
    camel2DashComponentName?: boolean;
}): (opts: {
    rawCode: string;
    imports: ImportSpecifier[];
    mfName: string;
    alias: Record<string, string>;
    pathToVersion(p: string): string;
}) => Match[];
