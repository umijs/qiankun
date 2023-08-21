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
const util = __importStar(require("../util"));
exports.default = util.createRule({
    name: 'no-non-null-asserted-optional-chain',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow non-null assertions after an optional chain expression',
            recommended: 'recommended',
        },
        hasSuggestions: true,
        messages: {
            noNonNullOptionalChain: 'Optional chain expressions can return undefined by design - using a non-null assertion is unsafe and wrong.',
            suggestRemovingNonNull: 'You should remove the non-null assertion.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            // non-nulling a wrapped chain will scrub all nulls introduced by the chain
            // (x?.y)!
            // (x?.())!
            'TSNonNullExpression > ChainExpression'(node) {
                // selector guarantees this assertion
                const parent = node.parent;
                context.report({
                    node,
                    messageId: 'noNonNullOptionalChain',
                    // use a suggestion instead of a fixer, because this can obviously break type checks
                    suggest: [
                        {
                            messageId: 'suggestRemovingNonNull',
                            fix(fixer) {
                                return fixer.removeRange([
                                    parent.range[1] - 1,
                                    parent.range[1],
                                ]);
                            },
                        },
                    ],
                });
            },
            // non-nulling at the end of a chain will scrub all nulls introduced by the chain
            // x?.y!
            // x?.()!
            'ChainExpression > TSNonNullExpression'(node) {
                context.report({
                    node,
                    messageId: 'noNonNullOptionalChain',
                    // use a suggestion instead of a fixer, because this can obviously break type checks
                    suggest: [
                        {
                            messageId: 'suggestRemovingNonNull',
                            fix(fixer) {
                                return fixer.removeRange([node.range[1] - 1, node.range[1]]);
                            },
                        },
                    ],
                });
            },
        };
    },
});
//# sourceMappingURL=no-non-null-asserted-optional-chain.js.map