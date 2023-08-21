"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsutils = __importStar(require("ts-api-utils"));
const ts = __importStar(require("typescript"));
const util_1 = require("../util");
exports.default = (0, util_1.createRule)({
    name: 'switch-exhaustiveness-check',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require switch-case statements to be exhaustive with union type',
            requiresTypeChecking: true,
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            switchIsNotExhaustive: 'Switch is not exhaustive. Cases not matched: {{missingBranches}}',
            addMissingCases: 'Add branches for missing cases.',
        },
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.getSourceCode();
        const services = (0, util_1.getParserServices)(context);
        const checker = services.program.getTypeChecker();
        const compilerOptions = services.program.getCompilerOptions();
        function fixSwitch(fixer, node, missingBranchTypes, symbolName) {
            const lastCase = node.cases.length > 0 ? node.cases[node.cases.length - 1] : null;
            const caseIndent = lastCase
                ? ' '.repeat(lastCase.loc.start.column)
                : // if there are no cases, use indentation of the switch statement
                    // and leave it to user to format it correctly
                    ' '.repeat(node.loc.start.column);
            const missingCases = [];
            for (const missingBranchType of missingBranchTypes) {
                // While running this rule on checker.ts of TypeScript project
                // the fix introduced a compiler error due to:
                //
                // type __String = (string & {
                //         __escapedIdentifier: void;
                //     }) | (void & {
                //         __escapedIdentifier: void;
                //     }) | InternalSymbolName;
                //
                // The following check fixes it.
                if (missingBranchType.isIntersection()) {
                    continue;
                }
                const missingBranchName = missingBranchType.getSymbol()?.escapedName;
                let caseTest = checker.typeToString(missingBranchType);
                if (symbolName &&
                    (missingBranchName || missingBranchName === '') &&
                    (0, util_1.requiresQuoting)(missingBranchName.toString(), compilerOptions.target)) {
                    caseTest = `${symbolName}['${missingBranchName}']`;
                }
                const errorMessage = `Not implemented yet: ${caseTest} case`;
                missingCases.push(`case ${caseTest}: { throw new Error('${errorMessage}') }`);
            }
            const fixString = missingCases
                .map(code => `${caseIndent}${code}`)
                .join('\n');
            if (lastCase) {
                return fixer.insertTextAfter(lastCase, `\n${fixString}`);
            }
            // there were no existing cases
            const openingBrace = sourceCode.getTokenAfter(node.discriminant, util_1.isOpeningBraceToken);
            const closingBrace = sourceCode.getTokenAfter(node.discriminant, util_1.isClosingBraceToken);
            return fixer.replaceTextRange([openingBrace.range[0], closingBrace.range[1]], ['{', fixString, `${caseIndent}}`].join('\n'));
        }
        function checkSwitchExhaustive(node) {
            const discriminantType = (0, util_1.getConstrainedTypeAtLocation)(services, node.discriminant);
            const symbolName = discriminantType.getSymbol()?.escapedName;
            if (discriminantType.isUnion()) {
                const unionTypes = tsutils.unionTypeParts(discriminantType);
                const caseTypes = new Set();
                for (const switchCase of node.cases) {
                    if (switchCase.test == null) {
                        // Switch has 'default' branch - do nothing.
                        return;
                    }
                    caseTypes.add((0, util_1.getConstrainedTypeAtLocation)(services, switchCase.test));
                }
                const missingBranchTypes = unionTypes.filter(unionType => !caseTypes.has(unionType));
                if (missingBranchTypes.length === 0) {
                    // All cases matched - do nothing.
                    return;
                }
                context.report({
                    node: node.discriminant,
                    messageId: 'switchIsNotExhaustive',
                    data: {
                        missingBranches: missingBranchTypes
                            .map(missingType => tsutils.isTypeFlagSet(missingType, ts.TypeFlags.ESSymbolLike)
                            ? `typeof ${missingType.getSymbol()?.escapedName}`
                            : checker.typeToString(missingType))
                            .join(' | '),
                    },
                    suggest: [
                        {
                            messageId: 'addMissingCases',
                            fix(fixer) {
                                return fixSwitch(fixer, node, missingBranchTypes, symbolName?.toString());
                            },
                        },
                    ],
                });
            }
        }
        return {
            SwitchStatement: checkSwitchExhaustive,
        };
    },
});
//# sourceMappingURL=switch-exhaustiveness-check.js.map