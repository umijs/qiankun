/**
 * Changes after this point: https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes#typescript-40
 */
import TsCurrentModule from "typescript";
import * as TsThreeEightModule from "../../declarations/typescript3";
import { TsTransformPathsContext } from "../../types";
import { DownSampleTsTypes } from "../utils";
export declare namespace TsThreeEight {
    type TypeMap = [
        [
            TsCurrentModule.SourceFile,
            TsThreeEightModule.SourceFile
        ],
        [
            TsCurrentModule.StringLiteral,
            TsThreeEightModule.StringLiteral
        ],
        [
            TsCurrentModule.CompilerOptions,
            TsThreeEightModule.CompilerOptions
        ],
        [
            TsCurrentModule.EmitResolver,
            TsThreeEightModule.EmitResolver
        ],
        [
            TsCurrentModule.CallExpression,
            TsThreeEightModule.CallExpression
        ],
        [
            TsCurrentModule.ExternalModuleReference,
            TsThreeEightModule.ExternalModuleReference
        ],
        [
            TsCurrentModule.LiteralTypeNode,
            TsThreeEightModule.LiteralTypeNode
        ],
        [
            TsCurrentModule.ExternalModuleReference,
            TsThreeEightModule.ExternalModuleReference
        ],
        [
            TsCurrentModule.ImportTypeNode,
            TsThreeEightModule.ImportTypeNode
        ],
        [
            TsCurrentModule.EntityName,
            TsThreeEightModule.EntityName
        ],
        [
            TsCurrentModule.TypeNode,
            TsThreeEightModule.TypeNode
        ],
        [
            readonly TsCurrentModule.TypeNode[],
            readonly TsThreeEightModule.TypeNode[]
        ],
        [
            TsCurrentModule.LiteralTypeNode,
            TsThreeEightModule.LiteralTypeNode
        ],
        [
            TsCurrentModule.ImportDeclaration,
            TsThreeEightModule.ImportDeclaration
        ],
        [
            TsCurrentModule.ImportClause,
            TsThreeEightModule.ImportClause
        ],
        [
            TsCurrentModule.Identifier,
            TsThreeEightModule.Identifier
        ],
        [
            TsCurrentModule.NamedImportBindings,
            TsThreeEightModule.NamedImportBindings
        ],
        [
            TsCurrentModule.ImportDeclaration,
            TsThreeEightModule.ImportDeclaration
        ],
        [
            TsCurrentModule.ExportDeclaration,
            TsThreeEightModule.ExportDeclaration
        ],
        [
            TsCurrentModule.ModuleDeclaration,
            TsThreeEightModule.ModuleDeclaration
        ],
        [
            TsCurrentModule.Expression,
            TsThreeEightModule.Expression
        ],
        [
            TsCurrentModule.ModuleBody,
            TsThreeEightModule.ModuleBody
        ],
        [
            TsCurrentModule.ModuleName,
            TsThreeEightModule.ModuleName
        ],
        [
            TsCurrentModule.ExportDeclaration["exportClause"],
            TsThreeEightModule.ExportDeclaration["exportClause"]
        ]
    ];
}
export declare namespace TsThreeEight {
    const predicate: (context: TsTransformPathsContext) => boolean;
    function handler(context: TsTransformPathsContext, prop: string | symbol): (...args: any) => any;
    function downSample<T extends [...unknown[]]>(...args: T): DownSampleTsTypes<TypeMap, T>;
}
