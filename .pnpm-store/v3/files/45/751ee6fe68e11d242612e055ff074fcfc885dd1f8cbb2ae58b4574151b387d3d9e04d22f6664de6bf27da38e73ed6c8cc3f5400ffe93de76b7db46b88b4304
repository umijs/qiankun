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
const utils_1 = require("@typescript-eslint/utils");
const util = __importStar(require("../util"));
exports.default = util.createRule({
    name: 'class-methods-use-this',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce that class methods utilize `this`',
            extendsBaseRule: true,
            requiresTypeChecking: false,
        },
        fixable: 'code',
        hasSuggestions: false,
        schema: [
            {
                type: 'object',
                properties: {
                    exceptMethods: {
                        type: 'array',
                        description: 'Allows specified method names to be ignored with this rule',
                        items: {
                            type: 'string',
                        },
                    },
                    enforceForClassFields: {
                        type: 'boolean',
                        description: 'Enforces that functions used as instance field initializers utilize `this`',
                        default: true,
                    },
                    ignoreOverrideMethods: {
                        type: 'boolean',
                        description: 'Ingore members marked with the `override` modifier',
                    },
                    ignoreClassesThatImplementAnInterface: {
                        type: 'boolean',
                        description: 'Ignore classes that specifically implement some interface',
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            missingThis: "Expected 'this' to be used by class {{name}}.",
        },
    },
    defaultOptions: [
        {
            enforceForClassFields: true,
            exceptMethods: [],
            ignoreClassesThatImplementAnInterface: false,
            ignoreOverrideMethods: false,
        },
    ],
    create(context, [{ enforceForClassFields, exceptMethods: exceptMethodsRaw, ignoreClassesThatImplementAnInterface, ignoreOverrideMethods, },]) {
        const exceptMethods = new Set(exceptMethodsRaw);
        let stack;
        const sourceCode = context.getSourceCode();
        function pushContext(member) {
            if (member?.parent.type === utils_1.AST_NODE_TYPES.ClassBody) {
                stack = {
                    member,
                    class: member.parent.parent,
                    usesThis: false,
                    parent: stack,
                };
            }
            else {
                stack = {
                    member: null,
                    class: null,
                    usesThis: false,
                    parent: stack,
                };
            }
        }
        function enterFunction(node) {
            if (node.parent.type === utils_1.AST_NODE_TYPES.MethodDefinition ||
                node.parent.type === utils_1.AST_NODE_TYPES.PropertyDefinition) {
                pushContext(node.parent);
            }
            else {
                pushContext();
            }
        }
        /**
         * Pop `this` used flag from the stack.
         */
        function popContext() {
            const oldStack = stack;
            stack = stack?.parent;
            return oldStack;
        }
        /**
         * Check if the node is an instance method not excluded by config
         */
        function isIncludedInstanceMethod(node) {
            if (node.static ||
                (node.type === utils_1.AST_NODE_TYPES.MethodDefinition &&
                    node.kind === 'constructor') ||
                (node.type === utils_1.AST_NODE_TYPES.PropertyDefinition &&
                    !enforceForClassFields)) {
                return false;
            }
            if (node.computed || exceptMethods.size === 0) {
                return true;
            }
            const hashIfNeeded = node.key.type === utils_1.AST_NODE_TYPES.PrivateIdentifier ? '#' : '';
            const name = node.key.type === utils_1.AST_NODE_TYPES.Literal
                ? util.getStaticStringValue(node.key)
                : node.key.name || '';
            return !exceptMethods.has(hashIfNeeded + (name ?? ''));
        }
        /**
         * Checks if we are leaving a function that is a method, and reports if 'this' has not been used.
         * Static methods and the constructor are exempt.
         * Then pops the context off the stack.
         */
        function exitFunction(node) {
            const stackContext = popContext();
            if (stackContext?.member == null ||
                stackContext.class == null ||
                stackContext.usesThis ||
                (ignoreOverrideMethods && stackContext.member.override) ||
                (ignoreClassesThatImplementAnInterface &&
                    stackContext.class.implements != null)) {
                return;
            }
            if (isIncludedInstanceMethod(stackContext.member)) {
                context.report({
                    node,
                    loc: util.getFunctionHeadLoc(node, sourceCode),
                    messageId: 'missingThis',
                    data: {
                        name: util.getFunctionNameWithKind(node),
                    },
                });
            }
        }
        return {
            // function declarations have their own `this` context
            FunctionDeclaration() {
                pushContext();
            },
            'FunctionDeclaration:exit'() {
                popContext();
            },
            FunctionExpression(node) {
                enterFunction(node);
            },
            'FunctionExpression:exit'(node) {
                exitFunction(node);
            },
            ...(enforceForClassFields
                ? {
                    'PropertyDefinition > ArrowFunctionExpression.value'(node) {
                        enterFunction(node);
                    },
                    'PropertyDefinition > ArrowFunctionExpression.value:exit'(node) {
                        exitFunction(node);
                    },
                }
                : {}),
            /*
             * Class field value are implicit functions.
             */
            'PropertyDefinition > *.key:exit'() {
                pushContext();
            },
            'PropertyDefinition:exit'() {
                popContext();
            },
            /*
             * Class static blocks are implicit functions. They aren't required to use `this`,
             * but we have to push context so that it captures any use of `this` in the static block
             * separately from enclosing contexts, because static blocks have their own `this` and it
             * shouldn't count as used `this` in enclosing contexts.
             */
            StaticBlock() {
                pushContext();
            },
            'StaticBlock:exit'() {
                popContext();
            },
            'ThisExpression, Super'() {
                if (stack) {
                    stack.usesThis = true;
                }
            },
        };
    },
});
//# sourceMappingURL=class-methods-use-this.js.map