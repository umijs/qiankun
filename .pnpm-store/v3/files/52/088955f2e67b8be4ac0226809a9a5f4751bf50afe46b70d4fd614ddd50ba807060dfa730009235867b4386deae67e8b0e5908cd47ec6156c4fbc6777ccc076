"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const ts = __importStar(require("typescript")); // leave this as * as ts so people using util package don't need syntheticDefaultImports
const ast_converter_1 = __importDefault(require("./ast-converter"));
const convert_1 = require("./convert");
const node_utils_1 = require("./node-utils");
const semantic_errors_1 = require("./semantic-errors");
const tsconfig_parser_1 = require("./tsconfig-parser");
/**
 * This needs to be kept in sync with the top-level README.md in the
 * typescript-eslint monorepo
 */
const SUPPORTED_TYPESCRIPT_VERSIONS = '>=3.2.1 <3.6.0';
const ACTIVE_TYPESCRIPT_VERSION = ts.version;
const isRunningSupportedTypeScriptVersion = semver_1.default.satisfies(ACTIVE_TYPESCRIPT_VERSION, SUPPORTED_TYPESCRIPT_VERSIONS);
let extra;
let warnedAboutTSVersion = false;
/**
 * Compute the filename based on the parser options.
 *
 * Even if jsx option is set in typescript compiler, filename still has to
 * contain .tsx file extension.
 *
 * @param options Parser options
 */
function getFileName({ jsx }) {
    return jsx ? 'estree.tsx' : 'estree.ts';
}
/**
 * Resets the extra config object
 */
function resetExtra() {
    extra = {
        tokens: null,
        range: false,
        loc: false,
        comment: false,
        comments: [],
        strict: false,
        jsx: false,
        useJSXTextNode: false,
        log: console.log,
        projects: [],
        errorOnUnknownASTType: false,
        errorOnTypeScriptSyntacticAndSemanticIssues: false,
        code: '',
        tsconfigRootDir: process.cwd(),
        extraFileExtensions: [],
        preserveNodeMaps: undefined,
    };
}
/**
 * @param code The code of the file being linted
 * @param options The config object
 * @returns If found, returns the source file corresponding to the code and the containing program
 */
function getASTFromProject(code, options) {
    return node_utils_1.firstDefined(tsconfig_parser_1.calculateProjectParserOptions(code, options.filePath || getFileName(options), extra), currentProgram => {
        const ast = currentProgram.getSourceFile(options.filePath || getFileName(options));
        return ast && { ast, program: currentProgram };
    });
}
/**
 * @param code The code of the file being linted
 * @param options The config object
 * @returns If found, returns the source file corresponding to the code and the containing program
 */
function getASTAndDefaultProject(code, options) {
    const fileName = options.filePath || getFileName(options);
    const program = tsconfig_parser_1.createProgram(code, fileName, extra);
    const ast = program && program.getSourceFile(fileName);
    return ast && { ast, program };
}
/**
 * @param code The code of the file being linted
 * @returns Returns a new source file and program corresponding to the linted code
 */
function createNewProgram(code) {
    const FILENAME = getFileName(extra);
    const compilerHost = {
        fileExists() {
            return true;
        },
        getCanonicalFileName() {
            return FILENAME;
        },
        getCurrentDirectory() {
            return '';
        },
        getDirectories() {
            return [];
        },
        getDefaultLibFileName() {
            return 'lib.d.ts';
        },
        // TODO: Support Windows CRLF
        getNewLine() {
            return '\n';
        },
        getSourceFile(filename) {
            return ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true);
        },
        readFile() {
            return undefined;
        },
        useCaseSensitiveFileNames() {
            return true;
        },
        writeFile() {
            return null;
        },
    };
    const program = ts.createProgram([FILENAME], {
        noResolve: true,
        target: ts.ScriptTarget.Latest,
        jsx: extra.jsx ? ts.JsxEmit.Preserve : undefined,
    }, compilerHost);
    const ast = program.getSourceFile(FILENAME);
    return { ast, program };
}
/**
 * @param code The code of the file being linted
 * @param options The config object
 * @param shouldProvideParserServices True iff the program should be attempted to be calculated from provided tsconfig files
 * @returns Returns a source file and program corresponding to the linted code
 */
function getProgramAndAST(code, options, shouldProvideParserServices) {
    return ((shouldProvideParserServices && getASTFromProject(code, options)) ||
        (shouldProvideParserServices && getASTAndDefaultProject(code, options)) ||
        createNewProgram(code));
}
function applyParserOptionsToExtra(options) {
    /**
     * Track range information in the AST
     */
    extra.range = typeof options.range === 'boolean' && options.range;
    extra.loc = typeof options.loc === 'boolean' && options.loc;
    /**
     * Track tokens in the AST
     */
    if (typeof options.tokens === 'boolean' && options.tokens) {
        extra.tokens = [];
    }
    /**
     * Track comments in the AST
     */
    if (typeof options.comment === 'boolean' && options.comment) {
        extra.comment = true;
        extra.comments = [];
    }
    /**
     * Enable JSX - note the applicable file extension is still required
     */
    if (typeof options.jsx === 'boolean' && options.jsx) {
        extra.jsx = true;
    }
    /**
     * The JSX AST changed the node type for string literals
     * inside a JSX Element from `Literal` to `JSXText`.
     *
     * When value is `true`, these nodes will be parsed as type `JSXText`.
     * When value is `false`, these nodes will be parsed as type `Literal`.
     */
    if (typeof options.useJSXTextNode === 'boolean' && options.useJSXTextNode) {
        extra.useJSXTextNode = true;
    }
    /**
     * Allow the user to cause the parser to error if it encounters an unknown AST Node Type
     * (used in testing)
     */
    if (typeof options.errorOnUnknownASTType === 'boolean' &&
        options.errorOnUnknownASTType) {
        extra.errorOnUnknownASTType = true;
    }
    /**
     * Allow the user to override the function used for logging
     */
    if (typeof options.loggerFn === 'function') {
        extra.log = options.loggerFn;
    }
    else if (options.loggerFn === false) {
        extra.log = Function.prototype;
    }
    if (typeof options.project === 'string') {
        extra.projects = [options.project];
    }
    else if (Array.isArray(options.project) &&
        options.project.every(projectPath => typeof projectPath === 'string')) {
        extra.projects = options.project;
    }
    if (typeof options.tsconfigRootDir === 'string') {
        extra.tsconfigRootDir = options.tsconfigRootDir;
    }
    if (Array.isArray(options.extraFileExtensions) &&
        options.extraFileExtensions.every(ext => typeof ext === 'string')) {
        extra.extraFileExtensions = options.extraFileExtensions;
    }
    /**
     * Allow the user to enable or disable the preservation of the AST node maps
     * during the conversion process.
     *
     * NOTE: For backwards compatibility we also preserve node maps in the case where `project` is set,
     * and `preserveNodeMaps` is not explicitly set to anything.
     */
    extra.preserveNodeMaps =
        typeof options.preserveNodeMaps === 'boolean' && options.preserveNodeMaps;
    if (options.preserveNodeMaps === undefined && extra.projects.length > 0) {
        extra.preserveNodeMaps = true;
    }
}
function warnAboutTSVersion() {
    if (!isRunningSupportedTypeScriptVersion && !warnedAboutTSVersion) {
        const border = '=============';
        const versionWarning = [
            border,
            'WARNING: You are currently running a version of TypeScript which is not officially supported by typescript-estree.',
            'You may find that it works just fine, or you may not.',
            `SUPPORTED TYPESCRIPT VERSIONS: ${SUPPORTED_TYPESCRIPT_VERSIONS}`,
            `YOUR TYPESCRIPT VERSION: ${ACTIVE_TYPESCRIPT_VERSION}`,
            'Please only submit bug reports when using the officially supported version.',
            border,
        ];
        extra.log(versionWarning.join('\n\n'));
        warnedAboutTSVersion = true;
    }
}
//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------
exports.version = require('../package.json').version;
function parse(code, options) {
    /**
     * Reset the parse configuration
     */
    resetExtra();
    /**
     * Ensure users do not attempt to use parse() when they need parseAndGenerateServices()
     */
    if (options && options.errorOnTypeScriptSyntacticAndSemanticIssues) {
        throw new Error(`"errorOnTypeScriptSyntacticAndSemanticIssues" is only supported for parseAndGenerateServices()`);
    }
    /**
     * Ensure the source code is a string, and store a reference to it
     */
    if (typeof code !== 'string' && !(code instanceof String)) {
        code = String(code);
    }
    extra.code = code;
    /**
     * Apply the given parser options
     */
    if (typeof options !== 'undefined') {
        applyParserOptionsToExtra(options);
    }
    /**
     * Warn if the user is using an unsupported version of TypeScript
     */
    warnAboutTSVersion();
    /**
     * Create a ts.SourceFile directly, no ts.Program is needed for a simple
     * parse
     */
    const ast = ts.createSourceFile(getFileName(extra), code, ts.ScriptTarget.Latest, 
    /* setParentNodes */ true);
    /**
     * Convert the TypeScript AST to an ESTree-compatible one
     */
    const { estree } = ast_converter_1.default(ast, extra, false);
    return estree;
}
exports.parse = parse;
function parseAndGenerateServices(code, options) {
    /**
     * Reset the parse configuration
     */
    resetExtra();
    /**
     * Ensure the source code is a string, and store a reference to it
     */
    if (typeof code !== 'string' && !(code instanceof String)) {
        code = String(code);
    }
    extra.code = code;
    /**
     * Apply the given parser options
     */
    if (typeof options !== 'undefined') {
        applyParserOptionsToExtra(options);
        if (typeof options.errorOnTypeScriptSyntacticAndSemanticIssues ===
            'boolean' &&
            options.errorOnTypeScriptSyntacticAndSemanticIssues) {
            extra.errorOnTypeScriptSyntacticAndSemanticIssues = true;
        }
    }
    /**
     * Warn if the user is using an unsupported version of TypeScript
     */
    warnAboutTSVersion();
    /**
     * Generate a full ts.Program in order to be able to provide parser
     * services, such as type-checking
     */
    const shouldProvideParserServices = extra.projects && extra.projects.length > 0;
    const { ast, program } = getProgramAndAST(code, options, shouldProvideParserServices);
    /**
     * Determine whether or not two-way maps of converted AST nodes should be preserved
     * during the conversion process
     */
    const shouldPreserveNodeMaps = extra.preserveNodeMaps !== undefined
        ? extra.preserveNodeMaps
        : shouldProvideParserServices;
    /**
     * Convert the TypeScript AST to an ESTree-compatible one, and optionally preserve
     * mappings between converted and original AST nodes
     */
    const { estree, astMaps } = ast_converter_1.default(ast, extra, shouldPreserveNodeMaps);
    /**
     * Even if TypeScript parsed the source code ok, and we had no problems converting the AST,
     * there may be other syntactic or semantic issues in the code that we can optionally report on.
     */
    if (program && extra.errorOnTypeScriptSyntacticAndSemanticIssues) {
        const error = semantic_errors_1.getFirstSemanticOrSyntacticError(program, ast);
        if (error) {
            throw convert_1.convertError(error);
        }
    }
    /**
     * Return the converted AST and additional parser services
     */
    return {
        ast: estree,
        services: {
            program: shouldProvideParserServices ? program : undefined,
            esTreeNodeToTSNodeMap: shouldPreserveNodeMaps && astMaps
                ? astMaps.esTreeNodeToTSNodeMap
                : undefined,
            tsNodeToESTreeNodeMap: shouldPreserveNodeMaps && astMaps
                ? astMaps.tsNodeToESTreeNodeMap
                : undefined,
        },
    };
}
exports.parseAndGenerateServices = parseAndGenerateServices;
__export(require("./ts-estree"));
//# sourceMappingURL=parser.js.map