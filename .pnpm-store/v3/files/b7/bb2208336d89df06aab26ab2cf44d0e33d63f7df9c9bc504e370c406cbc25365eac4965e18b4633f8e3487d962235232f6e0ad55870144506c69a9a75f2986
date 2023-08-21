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
exports.CommandLineParameterProvider = void 0;
const argparse = __importStar(require("argparse"));
const BaseClasses_1 = require("../parameters/BaseClasses");
const CommandLineChoiceParameter_1 = require("../parameters/CommandLineChoiceParameter");
const CommandLineChoiceListParameter_1 = require("../parameters/CommandLineChoiceListParameter");
const CommandLineIntegerParameter_1 = require("../parameters/CommandLineIntegerParameter");
const CommandLineIntegerListParameter_1 = require("../parameters/CommandLineIntegerListParameter");
const CommandLineFlagParameter_1 = require("../parameters/CommandLineFlagParameter");
const CommandLineStringParameter_1 = require("../parameters/CommandLineStringParameter");
const CommandLineStringListParameter_1 = require("../parameters/CommandLineStringListParameter");
const CommandLineRemainder_1 = require("../parameters/CommandLineRemainder");
const Constants_1 = require("../Constants");
const SCOPE_GROUP_NAME = 'scope';
const LONG_NAME_GROUP_NAME = 'longName';
const POSSIBLY_SCOPED_LONG_NAME_REGEXP = /^--((?<scope>[a-z0-9]+(-[a-z0-9]+)*):)?(?<longName>[a-z0-9]+((-[a-z0-9]+)+)?)$/;
/**
 * This is the common base class for CommandLineAction and CommandLineParser
 * that provides functionality for defining command-line parameters.
 *
 * @public
 */
class CommandLineParameterProvider {
    /** @internal */
    // Third party code should not inherit subclasses or call this constructor
    constructor() {
        this._parameters = [];
        this._parametersByLongName = new Map();
        this._parametersByShortName = new Map();
        this._parameterGroupsByName = new Map();
        this._ambiguousParameterNamesByParserKey = new Map();
        this._parametersRegistered = false;
        this._parametersProcessed = false;
    }
    /**
     * Returns a collection of the parameters that were defined for this object.
     */
    get parameters() {
        return this._parameters;
    }
    /**
     * Informs the caller if the argparse data has been processed into parameters.
     */
    get parametersProcessed() {
        return this._parametersProcessed;
    }
    /**
     * If {@link CommandLineParameterProvider.defineCommandLineRemainder} was called,
     * this object captures any remaining command line arguments after the recognized portion.
     */
    get remainder() {
        return this._remainder;
    }
    /**
     * Defines a command-line parameter whose value must be a string from a fixed set of
     * allowable choices (similar to an enum).
     *
     * @remarks
     * Example of a choice parameter:
     * ```
     * example-tool --log-level warn
     * ```
     */
    defineChoiceParameter(definition) {
        const parameter = new CommandLineChoiceParameter_1.CommandLineChoiceParameter(definition);
        this._defineParameter(parameter);
        return parameter;
    }
    /**
     * Returns the CommandLineChoiceParameter with the specified long name.
     * @remarks
     * This method throws an exception if the parameter is not defined.
     */
    getChoiceParameter(parameterLongName, parameterScope) {
        return this._getParameter(parameterLongName, BaseClasses_1.CommandLineParameterKind.Choice, parameterScope);
    }
    /**
     * Defines a command-line parameter whose value must be a string from a fixed set of
     * allowable choices (similar to an enum). The parameter can be specified multiple times to
     * build a list.
     *
     * @remarks
     * Example of a choice list parameter:
     * ```
     * example-tool --allow-color red --allow-color green
     * ```
     */
    defineChoiceListParameter(definition) {
        const parameter = new CommandLineChoiceListParameter_1.CommandLineChoiceListParameter(definition);
        this._defineParameter(parameter);
        return parameter;
    }
    /**
     * Returns the CommandLineChoiceListParameter with the specified long name.
     * @remarks
     * This method throws an exception if the parameter is not defined.
     */
    getChoiceListParameter(parameterLongName, parameterScope) {
        return this._getParameter(parameterLongName, BaseClasses_1.CommandLineParameterKind.ChoiceList, parameterScope);
    }
    /**
     * Defines a command-line switch whose boolean value is true if the switch is provided,
     * and false otherwise.
     *
     * @remarks
     * Example usage of a flag parameter:
     * ```
     * example-tool --debug
     * ```
     */
    defineFlagParameter(definition) {
        const parameter = new CommandLineFlagParameter_1.CommandLineFlagParameter(definition);
        this._defineParameter(parameter);
        return parameter;
    }
    /**
     * Returns the CommandLineFlagParameter with the specified long name.
     * @remarks
     * This method throws an exception if the parameter is not defined.
     */
    getFlagParameter(parameterLongName, parameterScope) {
        return this._getParameter(parameterLongName, BaseClasses_1.CommandLineParameterKind.Flag, parameterScope);
    }
    /**
     * Defines a command-line parameter whose argument is an integer.
     *
     * @remarks
     * Example usage of an integer parameter:
     * ```
     * example-tool --max-attempts 5
     * ```
     */
    defineIntegerParameter(definition) {
        const parameter = new CommandLineIntegerParameter_1.CommandLineIntegerParameter(definition);
        this._defineParameter(parameter);
        return parameter;
    }
    /**
     * Returns the CommandLineIntegerParameter with the specified long name.
     * @remarks
     * This method throws an exception if the parameter is not defined.
     */
    getIntegerParameter(parameterLongName, parameterScope) {
        return this._getParameter(parameterLongName, BaseClasses_1.CommandLineParameterKind.Integer, parameterScope);
    }
    /**
     * Defines a command-line parameter whose argument is an integer. The parameter can be specified
     * multiple times to build a list.
     *
     * @remarks
     * Example usage of an integer list parameter:
     * ```
     * example-tool --avoid 4 --avoid 13
     * ```
     */
    defineIntegerListParameter(definition) {
        const parameter = new CommandLineIntegerListParameter_1.CommandLineIntegerListParameter(definition);
        this._defineParameter(parameter);
        return parameter;
    }
    /**
     * Returns the CommandLineIntegerParameter with the specified long name.
     * @remarks
     * This method throws an exception if the parameter is not defined.
     */
    getIntegerListParameter(parameterLongName, parameterScope) {
        return this._getParameter(parameterLongName, BaseClasses_1.CommandLineParameterKind.IntegerList, parameterScope);
    }
    /**
     * Defines a command-line parameter whose argument is a single text string.
     *
     * @remarks
     * Example usage of a string parameter:
     * ```
     * example-tool --message "Hello, world!"
     * ```
     */
    defineStringParameter(definition) {
        const parameter = new CommandLineStringParameter_1.CommandLineStringParameter(definition);
        this._defineParameter(parameter);
        return parameter;
    }
    /**
     * Returns the CommandLineStringParameter with the specified long name.
     * @remarks
     * This method throws an exception if the parameter is not defined.
     */
    getStringParameter(parameterLongName, parameterScope) {
        return this._getParameter(parameterLongName, BaseClasses_1.CommandLineParameterKind.String, parameterScope);
    }
    /**
     * Defines a command-line parameter whose argument is a single text string.  The parameter can be
     * specified multiple times to build a list.
     *
     * @remarks
     * Example usage of a string list parameter:
     * ```
     * example-tool --add file1.txt --add file2.txt --add file3.txt
     * ```
     */
    defineStringListParameter(definition) {
        const parameter = new CommandLineStringListParameter_1.CommandLineStringListParameter(definition);
        this._defineParameter(parameter);
        return parameter;
    }
    /**
     * Defines a rule that captures any remaining command line arguments after the recognized portion.
     *
     * @remarks
     * This feature is useful for commands that pass their arguments along to an external tool, relying on
     * that tool to perform validation.  (It could also be used to parse parameters without any validation
     * or documentation, but that is not recommended.)
     *
     * Example of capturing the remainder after an optional flag parameter.
     * ```
     * example-tool --my-flag this is the remainder
     * ```
     *
     * In the "--help" documentation, the remainder rule will be represented as "...".
     */
    defineCommandLineRemainder(definition) {
        if (this._remainder) {
            throw new Error('defineRemainingArguments() has already been called for this provider');
        }
        this._remainder = new CommandLineRemainder_1.CommandLineRemainder(definition);
        return this._remainder;
    }
    /**
     * Returns the CommandLineStringListParameter with the specified long name.
     * @remarks
     * This method throws an exception if the parameter is not defined.
     */
    getStringListParameter(parameterLongName, parameterScope) {
        return this._getParameter(parameterLongName, BaseClasses_1.CommandLineParameterKind.StringList, parameterScope);
    }
    /**
     * Generates the command-line help text.
     */
    renderHelpText() {
        this._registerDefinedParameters();
        return this._getArgumentParser().formatHelp();
    }
    /**
     * Generates the command-line usage text.
     */
    renderUsageText() {
        this._registerDefinedParameters();
        return this._getArgumentParser().formatUsage();
    }
    /**
     * Returns a object which maps the long name of each parameter in this.parameters
     * to the stringified form of its value. This is useful for logging telemetry, but
     * it is not the proper way of accessing parameters or their values.
     */
    getParameterStringMap() {
        const parameterMap = {};
        for (const parameter of this.parameters) {
            const parameterName = parameter.scopedLongName || parameter.longName;
            switch (parameter.kind) {
                case BaseClasses_1.CommandLineParameterKind.Flag:
                case BaseClasses_1.CommandLineParameterKind.Choice:
                case BaseClasses_1.CommandLineParameterKind.String:
                case BaseClasses_1.CommandLineParameterKind.Integer:
                    parameterMap[parameterName] = JSON.stringify(parameter.value);
                    break;
                case BaseClasses_1.CommandLineParameterKind.StringList:
                case BaseClasses_1.CommandLineParameterKind.IntegerList:
                case BaseClasses_1.CommandLineParameterKind.ChoiceList:
                    const arrayValue = parameter.values;
                    parameterMap[parameterName] = arrayValue ? arrayValue.join(',') : '';
                    break;
            }
        }
        return parameterMap;
    }
    /**
     * Returns an object with the parsed scope (if present) and the long name of the parameter.
     */
    parseScopedLongName(scopedLongName) {
        const result = POSSIBLY_SCOPED_LONG_NAME_REGEXP.exec(scopedLongName);
        if (!result || !result.groups) {
            throw new Error(`The parameter long name "${scopedLongName}" is not valid.`);
        }
        return {
            longName: `--${result.groups[LONG_NAME_GROUP_NAME]}`,
            scope: result.groups[SCOPE_GROUP_NAME]
        };
    }
    /** @internal */
    _registerDefinedParameters() {
        if (this._parametersRegistered) {
            // We prevent new parameters from being defined after the first call to _registerDefinedParameters,
            // so we can already ensure that all parameters were registered.
            return;
        }
        this._parametersRegistered = true;
        const ambiguousParameterNames = new Set();
        // First, loop through all parameters with short names. If there are any duplicates, disable the short names
        // since we can't prefix scopes to short names in order to deduplicate them. The duplicate short names will
        // be reported as errors if the user attempts to use them.
        for (const [shortName, shortNameParameters] of this._parametersByShortName.entries()) {
            if (shortNameParameters.length > 1) {
                for (const parameter of shortNameParameters) {
                    ambiguousParameterNames.add(shortName);
                    parameter._disableShortName();
                }
            }
        }
        // Then, loop through all parameters and register them. If there are any duplicates, ensure that they have
        // provided a scope and register them with the scope. The duplicate long names will be reported as an error
        // if the user attempts to use them.
        for (const longNameParameters of this._parametersByLongName.values()) {
            const useScopedLongName = longNameParameters.length > 1;
            for (const parameter of longNameParameters) {
                if (useScopedLongName) {
                    if (!parameter.parameterScope) {
                        throw new Error(`The parameter "${parameter.longName}" is defined multiple times with the same long name. ` +
                            'Parameters with the same long name must define a scope.');
                    }
                    ambiguousParameterNames.add(parameter.longName);
                }
                this._registerParameter(parameter, useScopedLongName);
            }
        }
        // Register silent parameters for the ambiguous short names and long names to ensure that users are made
        // aware that the provided argument is ambiguous.
        for (const ambiguousParameterName of ambiguousParameterNames) {
            this._registerAmbiguousParameter(ambiguousParameterName);
        }
        // Need to add the remainder parameter last
        if (this._remainder) {
            const argparseOptions = {
                help: this._remainder.description,
                nargs: argparse.Const.REMAINDER,
                metavar: '"..."'
            };
            this._getArgumentParser().addArgument(argparse.Const.REMAINDER, argparseOptions);
        }
    }
    /** @internal */
    _processParsedData(parserOptions, data) {
        if (!this._parametersRegistered) {
            throw new Error('Parameters have not been registered');
        }
        if (this._parametersProcessed) {
            throw new Error('Command Line Parser Data was already processed');
        }
        // Search for any ambiguous parameters and throw an error if any are found
        for (const [parserKey, parameterName] of this._ambiguousParameterNamesByParserKey) {
            if (data[parserKey]) {
                // Determine if the ambiguous parameter is a short name or a long name, since the process of finding
                // the non-ambiguous name is different for each.
                const duplicateShortNameParameters = this._parametersByShortName.get(parameterName);
                if (duplicateShortNameParameters) {
                    // We also need to make sure we get the non-ambiguous long name for the parameter, since it is
                    // possible for that the long name is ambiguous as well.
                    const nonAmbiguousLongNames = [];
                    for (const parameter of duplicateShortNameParameters) {
                        const matchingLongNameParameters = this._parametersByLongName.get(parameter.longName);
                        if (!(matchingLongNameParameters === null || matchingLongNameParameters === void 0 ? void 0 : matchingLongNameParameters.length)) {
                            // This should never happen
                            throw new Error(`Unable to find long name parameters for ambiguous short name parameter "${parameterName}".`);
                        }
                        // If there is more than one matching long name parameter, then we know that we need to use the
                        // scoped long name for the parameter. The scoped long name should always be provided.
                        if (matchingLongNameParameters.length > 1) {
                            if (!parameter.scopedLongName) {
                                // This should never happen
                                throw new Error(`Unable to find scoped long name for ambiguous short name parameter "${parameterName}".`);
                            }
                            nonAmbiguousLongNames.push(parameter.scopedLongName);
                        }
                        else {
                            nonAmbiguousLongNames.push(parameter.longName);
                        }
                    }
                    // Throw an error including the non-ambiguous long names for the parameters that have the ambiguous
                    // short name, ex.
                    // Error: The short parameter name "-p" is ambiguous. It could refer to any of the following
                    // parameters: "--param1", "--param2"
                    throw new Error(`The short parameter name "${parameterName}" is ambiguous. It could refer to any of ` +
                        `the following parameters: "${nonAmbiguousLongNames.join('", "')}"`);
                }
                const duplicateLongNameParameters = this._parametersByLongName.get(parameterName);
                if (duplicateLongNameParameters) {
                    const nonAmbiguousLongNames = duplicateLongNameParameters.map((p) => {
                        // The scoped long name should always be provided
                        if (!p.scopedLongName) {
                            // This should never happen
                            throw new Error(`Unable to find scoped long name for ambiguous long name parameter "${parameterName}".`);
                        }
                        return p.scopedLongName;
                    });
                    // Throw an error including the non-ambiguous scoped long names for the parameters that have the
                    // ambiguous long name, ex.
                    // Error: The parameter name "--param" is ambiguous. It could refer to any of the following
                    // parameters: "--scope1:param", "--scope2:param"
                    throw new Error(`The parameter name "${parameterName}" is ambiguous. It could refer to any of ` +
                        `the following parameters: "${nonAmbiguousLongNames.join('", "')}"`);
                }
                // This shouldn't happen, but we also shouldn't allow the user to use the ambiguous parameter
                throw new Error(`The parameter name "${parameterName}" is ambiguous.`);
            }
        }
        // Fill in the values for the parameters
        for (const parameter of this._parameters) {
            const value = data[parameter._parserKey]; // eslint-disable-line @typescript-eslint/no-explicit-any
            parameter._setValue(value);
        }
        if (this.remainder) {
            this.remainder._setValue(data[argparse.Const.REMAINDER]);
        }
        this._parametersProcessed = true;
    }
    /** @internal */
    _defineParameter(parameter) {
        if (this._parametersRegistered) {
            throw new Error('Parameters have already been registered for this provider');
        }
        // Generate and set the parser key at definition time
        parameter._parserKey = this._generateKey();
        this._parameters.push(parameter);
        // Collect all parameters with the same long name. We will perform conflict resolution at registration.
        let longNameParameters = this._parametersByLongName.get(parameter.longName);
        if (!longNameParameters) {
            longNameParameters = [];
            this._parametersByLongName.set(parameter.longName, longNameParameters);
        }
        longNameParameters.push(parameter);
        // Collect all parameters with the same short name. We will perform conflict resolution at registration.
        if (parameter.shortName) {
            let shortNameParameters = this._parametersByShortName.get(parameter.shortName);
            if (!shortNameParameters) {
                shortNameParameters = [];
                this._parametersByShortName.set(parameter.shortName, shortNameParameters);
            }
            shortNameParameters.push(parameter);
        }
    }
    /** @internal */
    _registerParameter(parameter, useScopedLongName) {
        var _a;
        const names = [];
        if (parameter.shortName) {
            names.push(parameter.shortName);
        }
        // Use the original long name unless otherwise requested
        if (!useScopedLongName) {
            names.push(parameter.longName);
        }
        // Add the scoped long name if it exists
        if (parameter.scopedLongName) {
            names.push(parameter.scopedLongName);
        }
        let finalDescription = parameter.description;
        const supplementaryNotes = [];
        parameter._getSupplementaryNotes(supplementaryNotes);
        if (supplementaryNotes.length > 0) {
            // If they left the period off the end of their sentence, then add one.
            if (finalDescription.match(/[a-z0-9]"?\s*$/i)) {
                finalDescription = finalDescription.trimRight() + '.';
            }
            // Append the supplementary text
            finalDescription += ' ' + supplementaryNotes.join(' ');
        }
        // NOTE: Our "environmentVariable" feature takes precedence over argparse's "defaultValue",
        // so we have to reimplement that feature.
        const argparseOptions = {
            help: finalDescription,
            dest: parameter._parserKey,
            metavar: parameter.argumentName || undefined,
            required: parameter.required
        };
        switch (parameter.kind) {
            case BaseClasses_1.CommandLineParameterKind.Choice: {
                const choiceParameter = parameter;
                argparseOptions.choices = choiceParameter.alternatives;
                break;
            }
            case BaseClasses_1.CommandLineParameterKind.ChoiceList: {
                const choiceParameter = parameter;
                argparseOptions.choices = choiceParameter.alternatives;
                argparseOptions.action = 'append';
                break;
            }
            case BaseClasses_1.CommandLineParameterKind.Flag:
                argparseOptions.action = 'storeTrue';
                break;
            case BaseClasses_1.CommandLineParameterKind.Integer:
                argparseOptions.type = 'int';
                break;
            case BaseClasses_1.CommandLineParameterKind.IntegerList:
                argparseOptions.type = 'int';
                argparseOptions.action = 'append';
                break;
            case BaseClasses_1.CommandLineParameterKind.String:
                break;
            case BaseClasses_1.CommandLineParameterKind.StringList:
                argparseOptions.action = 'append';
                break;
        }
        let argumentGroup;
        if (parameter.parameterGroup) {
            argumentGroup = this._parameterGroupsByName.get(parameter.parameterGroup);
            if (!argumentGroup) {
                let parameterGroupName;
                if (typeof parameter.parameterGroup === 'string') {
                    parameterGroupName = parameter.parameterGroup;
                }
                else if (parameter.parameterGroup === Constants_1.SCOPING_PARAMETER_GROUP) {
                    parameterGroupName = 'scoping';
                }
                else {
                    throw new Error('Unexpected parameter group: ' + parameter.parameterGroup);
                }
                argumentGroup = this._getArgumentParser().addArgumentGroup({
                    title: `Optional ${parameterGroupName} arguments`
                });
                this._parameterGroupsByName.set(parameter.parameterGroup, argumentGroup);
            }
        }
        else {
            argumentGroup = this._getArgumentParser();
        }
        argumentGroup.addArgument(names, Object.assign({}, argparseOptions));
        if ((_a = parameter.undocumentedSynonyms) === null || _a === void 0 ? void 0 : _a.length) {
            argumentGroup.addArgument(parameter.undocumentedSynonyms, Object.assign(Object.assign({}, argparseOptions), { help: argparse.Const.SUPPRESS }));
        }
    }
    _registerAmbiguousParameter(name) {
        const parserKey = this._generateKey();
        this._ambiguousParameterNamesByParserKey.set(parserKey, name);
        this._getArgumentParser().addArgument(name, {
            dest: parserKey,
            // We don't know if this argument takes parameters or not, so we need to accept any number of args
            nargs: '*',
            // Ensure that the argument is not shown in the help text, since these parameters are only included
            // to inform the user that ambiguous parameters are present
            help: argparse.Const.SUPPRESS
        });
    }
    _generateKey() {
        return 'key_' + (CommandLineParameterProvider._keyCounter++).toString();
    }
    _getParameter(parameterLongName, expectedKind, parameterScope) {
        // Support the parameter long name being prefixed with the scope
        const { scope, longName } = this.parseScopedLongName(parameterLongName);
        parameterLongName = longName;
        parameterScope = scope || parameterScope;
        const parameters = this._parametersByLongName.get(parameterLongName);
        if (!parameters) {
            throw new Error(`The parameter "${parameterLongName}" is not defined`);
        }
        let parameter = parameters.find((p) => p.parameterScope === parameterScope);
        if (!parameter) {
            if (parameterScope !== undefined) {
                throw new Error(`The parameter "${parameterLongName}" with scope "${parameterScope}" is not defined.`);
            }
            if (parameters.length !== 1) {
                throw new Error(`The parameter "${parameterLongName}" is ambiguous. You must specify a scope.`);
            }
            parameter = parameters[0];
        }
        if (parameter.kind !== expectedKind) {
            throw new Error(`The parameter "${parameterLongName}" is of type "${BaseClasses_1.CommandLineParameterKind[parameter.kind]}"` +
                ` whereas the caller was expecting "${BaseClasses_1.CommandLineParameterKind[expectedKind]}".`);
        }
        return parameter;
    }
}
CommandLineParameterProvider._keyCounter = 0;
exports.CommandLineParameterProvider = CommandLineParameterProvider;
//# sourceMappingURL=CommandLineParameterProvider.js.map