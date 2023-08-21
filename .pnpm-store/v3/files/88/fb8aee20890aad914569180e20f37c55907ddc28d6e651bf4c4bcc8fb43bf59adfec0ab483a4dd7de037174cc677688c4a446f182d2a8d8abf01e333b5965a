import type { Program } from 'typescript';
import type { Lib } from './lib';
type DebugLevel = ('eslint' | 'typescript-eslint' | 'typescript')[] | boolean;
type CacheDurationSeconds = number | 'Infinity';
type EcmaVersion = 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022;
type SourceType = 'module' | 'script';
interface ParserOptions {
    ecmaFeatures?: {
        globalReturn?: boolean;
        jsx?: boolean;
    };
    ecmaVersion?: EcmaVersion | 'latest';
    jsxPragma?: string | null;
    jsxFragmentName?: string | null;
    lib?: Lib[];
    emitDecoratorMetadata?: boolean;
    comment?: boolean;
    debugLevel?: DebugLevel;
    errorOnTypeScriptSyntacticAndSemanticIssues?: boolean;
    errorOnUnknownASTType?: boolean;
    EXPERIMENTAL_useProjectService?: boolean;
    EXPERIMENTAL_useSourceOfProjectReferenceRedirect?: boolean;
    extraFileExtensions?: string[];
    filePath?: string;
    loc?: boolean;
    program?: Program | null;
    project?: string[] | string | true | null;
    projectFolderIgnoreList?: (RegExp | string)[];
    range?: boolean;
    sourceType?: SourceType;
    tokens?: boolean;
    tsconfigRootDir?: string;
    warnOnUnsupportedTypeScriptVersion?: boolean;
    cacheLifetime?: {
        glob?: CacheDurationSeconds;
    };
    [additionalProperties: string]: unknown;
}
export { CacheDurationSeconds, DebugLevel, EcmaVersion, ParserOptions, SourceType, };
//# sourceMappingURL=parser-options.d.ts.map