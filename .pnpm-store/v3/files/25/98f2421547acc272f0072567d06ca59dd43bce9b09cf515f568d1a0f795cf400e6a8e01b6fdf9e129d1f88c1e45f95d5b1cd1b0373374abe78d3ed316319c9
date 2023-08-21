/**
 * Changes after this point: https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes#typescript-48
 */
import TsCurrentModule from "typescript";
import TsFourSevenModule from "../../declarations/typescript4.7";
import { TsTransformPathsContext } from "../../types";
import { DownSampleTsTypes } from "../utils";
export declare namespace TsFourSeven {
    type TypeMap = [
        [
            TsCurrentModule.ImportDeclaration,
            TsFourSevenModule.ImportDeclaration
        ],
        [
            TsCurrentModule.Modifier,
            TsFourSevenModule.Modifier
        ],
        [
            TsCurrentModule.ImportClause,
            TsFourSevenModule.ImportClause
        ],
        [
            TsCurrentModule.Expression,
            TsFourSevenModule.Expression
        ],
        [
            TsCurrentModule.AssertClause,
            TsFourSevenModule.AssertClause
        ],
        [
            TsCurrentModule.ExportDeclaration,
            TsFourSevenModule.ExportDeclaration
        ],
        [
            TsCurrentModule.NamedExportBindings,
            TsFourSevenModule.NamedExportBindings
        ],
        [
            TsCurrentModule.ModuleDeclaration,
            TsFourSevenModule.ModuleDeclaration
        ],
        [
            TsCurrentModule.ModuleName,
            TsFourSevenModule.ModuleName
        ],
        [
            TsCurrentModule.ModuleBody,
            TsFourSevenModule.ModuleBody
        ]
    ];
}
export declare namespace TsFourSeven {
    const predicate: ({ tsVersionMajor, tsVersionMinor }: TsTransformPathsContext) => boolean;
    function handler(context: TsTransformPathsContext, prop: string | symbol): (...args: any) => any;
    function downSample<T extends [...unknown[]]>(...args: T): DownSampleTsTypes<TypeMap, T>;
}
