import ts from "typescript";
import { TsTransformPathsConfig } from "./types";
import { TransformerExtras } from "ts-patch";
export default function transformer(program?: ts.Program, pluginConfig?: TsTransformPathsConfig, transformerExtras?: TransformerExtras, 
/**
 * Supply if manually transforming with compiler API via 'transformNodes' / 'transformModule'
 */
manualTransformOptions?: {
    compilerOptions?: ts.CompilerOptions;
    fileNames?: string[];
}): (transformationContext: ts.TransformationContext) => (sourceFile: ts.SourceFile) => ts.SourceFile;
