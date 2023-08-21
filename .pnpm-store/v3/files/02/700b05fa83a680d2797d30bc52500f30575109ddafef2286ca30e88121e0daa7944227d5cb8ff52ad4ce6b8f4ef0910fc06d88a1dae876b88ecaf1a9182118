"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
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
exports.AliasCommandLineAction = void 0;
const argparse = __importStar(require("argparse"));
const CommandLineAction_1 = require("./CommandLineAction");
const BaseClasses_1 = require("../parameters/BaseClasses");
/**
 * Represents a sub-command that is part of the CommandLineParser command line.
 * The sub-command is an alias for another existing action.
 *
 * The alias name should be comprised of lower case words separated by hyphens
 * or colons. The name should include an English verb (e.g. "deploy"). Use a
 * hyphen to separate words (e.g. "upload-docs").
 *
 * @public
 */
class AliasCommandLineAction extends CommandLineAction_1.CommandLineAction {
    constructor(options) {
        const toolFilename = options.toolFilename;
        const targetActionName = options.targetAction.actionName;
        const defaultParametersString = (options.defaultParameters || []).join(' ');
        const summary = `An alias for "${toolFilename} ${targetActionName}${defaultParametersString ? ` ${defaultParametersString}` : ''}".`;
        super({
            actionName: options.aliasName,
            summary,
            documentation: `${summary} For more information on the aliased command, use ` +
                `"${toolFilename} ${targetActionName} --help".`
        });
        this._parameterKeyMap = new Map();
        this.targetAction = options.targetAction;
        this.defaultParameters = options.defaultParameters || [];
    }
    /** @internal */
    _registerDefinedParameters() {
        /* override */
        // All parameters are going to be defined by the target action. Re-use the target action parameters
        // for this action.
        for (const parameter of this.targetAction.parameters) {
            let aliasParameter;
            const nameOptions = {
                parameterLongName: parameter.longName,
                parameterShortName: parameter.shortName
            };
            switch (parameter.kind) {
                case BaseClasses_1.CommandLineParameterKind.Choice:
                    const choiceParameter = parameter;
                    aliasParameter = this.defineChoiceParameter(Object.assign(Object.assign(Object.assign({}, nameOptions), choiceParameter), { alternatives: [].concat(choiceParameter.alternatives) }));
                    break;
                case BaseClasses_1.CommandLineParameterKind.ChoiceList:
                    const choiceListParameter = parameter;
                    aliasParameter = this.defineChoiceListParameter(Object.assign(Object.assign(Object.assign({}, nameOptions), choiceListParameter), { alternatives: [].concat(choiceListParameter.alternatives) }));
                    break;
                case BaseClasses_1.CommandLineParameterKind.Flag:
                    const flagParameter = parameter;
                    aliasParameter = this.defineFlagParameter(Object.assign(Object.assign({}, nameOptions), flagParameter));
                    break;
                case BaseClasses_1.CommandLineParameterKind.Integer:
                    const integerParameter = parameter;
                    aliasParameter = this.defineIntegerParameter(Object.assign(Object.assign({}, nameOptions), integerParameter));
                    break;
                case BaseClasses_1.CommandLineParameterKind.IntegerList:
                    const integerListParameter = parameter;
                    aliasParameter = this.defineIntegerListParameter(Object.assign(Object.assign({}, nameOptions), integerListParameter));
                    break;
                case BaseClasses_1.CommandLineParameterKind.String:
                    const stringParameter = parameter;
                    aliasParameter = this.defineStringParameter(Object.assign(Object.assign({}, nameOptions), stringParameter));
                    break;
                case BaseClasses_1.CommandLineParameterKind.StringList:
                    const stringListParameter = parameter;
                    aliasParameter = this.defineStringListParameter(Object.assign(Object.assign({}, nameOptions), stringListParameter));
                    break;
                default:
                    throw new Error(`Unsupported parameter kind: ${parameter.kind}`);
            }
            // We know the parserKey is defined because the underlying _defineParameter method sets it,
            // and all parameters that we have access to have already been defined.
            this._parameterKeyMap.set(aliasParameter._parserKey, parameter._parserKey);
        }
        // We also need to register the remainder parameter if the target action has one. The parser
        // key for this parameter is constant.
        if (this.targetAction.remainder) {
            this.defineCommandLineRemainder(this.targetAction.remainder);
            this._parameterKeyMap.set(argparse.Const.REMAINDER, argparse.Const.REMAINDER);
        }
        // Finally, register the parameters with the parser.
        super._registerDefinedParameters();
    }
    /**
     * This is called internally by CommandLineParser.execute()
     * @internal
     */
    _processParsedData(parserOptions, data) {
        // Re-map the parsed data to the target action's parameters and execute the target action processor.
        const targetData = {
            action: this.targetAction.actionName,
            aliasAction: data.action,
            aliasDocumentation: this.documentation
        };
        for (const [key, value] of Object.entries(data)) {
            // If we have a mapping for the specified key, then use it. Otherwise, use the key as-is.
            // Skip over the action key though, since we've already re-mapped it to "aliasAction"
            if (key === 'action') {
                continue;
            }
            const targetKey = this._parameterKeyMap.get(key);
            targetData[targetKey !== null && targetKey !== void 0 ? targetKey : key] = value;
        }
        this.targetAction._processParsedData(parserOptions, targetData);
    }
    /**
     * Executes the target action.
     */
    async onExecute() {
        await this.targetAction._execute();
    }
}
exports.AliasCommandLineAction = AliasCommandLineAction;
//# sourceMappingURL=AliasCommandLineAction.js.map