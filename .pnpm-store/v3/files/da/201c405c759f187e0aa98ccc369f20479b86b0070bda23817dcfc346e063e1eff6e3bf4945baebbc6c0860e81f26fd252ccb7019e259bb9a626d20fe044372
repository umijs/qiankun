"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLineChoiceParameter = void 0;
const BaseClasses_1 = require("./BaseClasses");
/**
 * The data type returned by {@link CommandLineParameterProvider.defineChoiceParameter}.
 * @public
 */
class CommandLineChoiceParameter extends BaseClasses_1.CommandLineParameter {
    /** @internal */
    constructor(definition) {
        super(definition);
        this._value = undefined;
        if (definition.alternatives.length < 1) {
            throw new Error(`When defining a choice parameter, the alternatives list must contain at least one value.`);
        }
        if (definition.defaultValue && definition.alternatives.indexOf(definition.defaultValue) === -1) {
            throw new Error(`The specified default value "${definition.defaultValue}"` +
                ` is not one of the available options: ${definition.alternatives.toString()}`);
        }
        this.alternatives = definition.alternatives;
        this.defaultValue = definition.defaultValue;
        this.validateDefaultValue(!!this.defaultValue);
        this.completions = definition.completions;
    }
    /** {@inheritDoc CommandLineParameter.kind} */
    get kind() {
        return BaseClasses_1.CommandLineParameterKind.Choice;
    }
    /**
     * {@inheritDoc CommandLineParameter._setValue}
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _setValue(data) {
        // abstract
        if (data !== null && data !== undefined) {
            if (typeof data !== 'string') {
                this.reportInvalidData(data);
            }
            this._value = data;
            return;
        }
        if (this.environmentVariable !== undefined) {
            // Try reading the environment variable
            const environmentValue = process.env[this.environmentVariable];
            if (environmentValue !== undefined && environmentValue !== '') {
                if (this.alternatives.indexOf(environmentValue) < 0) {
                    const choices = '"' + this.alternatives.join('", "') + '"';
                    throw new Error(`Invalid value "${environmentValue}" for the environment variable` +
                        ` ${this.environmentVariable}.  Valid choices are: ${choices}`);
                }
                this._value = environmentValue;
                return;
            }
        }
        if (this.defaultValue !== undefined) {
            this._value = this.defaultValue;
            return;
        }
        this._value = undefined;
    }
    /**
     * {@inheritDoc CommandLineParameter._getSupplementaryNotes}
     * @internal
     */
    _getSupplementaryNotes(supplementaryNotes) {
        // virtual
        super._getSupplementaryNotes(supplementaryNotes);
        if (this.defaultValue !== undefined) {
            supplementaryNotes.push(`The default value is "${this.defaultValue}".`);
        }
    }
    /**
     * Returns the argument value for a choice parameter that was parsed from the command line.
     *
     * @remarks
     * The return value will be `undefined` if the command-line has not been parsed yet,
     * or if the parameter was omitted and has no default value.
     */
    get value() {
        return this._value;
    }
    /** {@inheritDoc CommandLineParameter.appendToArgList} @override */
    appendToArgList(argList) {
        if (this.value !== undefined) {
            argList.push(this.longName);
            argList.push(this.value);
        }
    }
}
exports.CommandLineChoiceParameter = CommandLineChoiceParameter;
//# sourceMappingURL=CommandLineChoiceParameter.js.map