"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLineChoiceListParameter = void 0;
const BaseClasses_1 = require("./BaseClasses");
const EnvironmentVariableParser_1 = require("./EnvironmentVariableParser");
/**
 * The data type returned by {@link CommandLineParameterProvider.defineChoiceListParameter}.
 * @public
 */
class CommandLineChoiceListParameter extends BaseClasses_1.CommandLineParameter {
    /** @internal */
    constructor(definition) {
        super(definition);
        this._values = [];
        if (definition.alternatives.length < 1) {
            throw new Error(`When defining a choice list parameter, the alternatives list must contain at least one value.`);
        }
        this.alternatives = definition.alternatives;
        this.completions = definition.completions;
    }
    /** {@inheritDoc CommandLineParameter.kind} */
    get kind() {
        return BaseClasses_1.CommandLineParameterKind.ChoiceList;
    }
    /**
     * {@inheritDoc CommandLineParameter._setValue}
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _setValue(data) {
        // If argparse passed us a value, confirm it is valid
        if (data !== null && data !== undefined) {
            if (!Array.isArray(data)) {
                this.reportInvalidData(data);
            }
            for (const arrayItem of data) {
                if (typeof arrayItem !== 'string') {
                    this.reportInvalidData(data);
                }
            }
            this._values = data;
            return;
        }
        if (this.environmentVariable !== undefined) {
            const values = EnvironmentVariableParser_1.EnvironmentVariableParser.parseAsList(this.environmentVariable);
            if (values) {
                for (const value of values) {
                    if (this.alternatives.indexOf(value) < 0) {
                        const choices = '"' + this.alternatives.join('", "') + '"';
                        throw new Error(`Invalid value "${value}" for the environment variable` +
                            ` ${this.environmentVariable}.  Valid choices are: ${choices}`);
                    }
                }
                this._values = values;
                return;
            }
        }
        // (No default value for choice lists)
        this._values = [];
    }
    /**
     * Returns the string arguments for a choice list parameter that was parsed from the command line.
     *
     * @remarks
     * The array will be empty if the command-line has not been parsed yet,
     * or if the parameter was omitted and has no default value.
     */
    get values() {
        return this._values;
    }
    /** {@inheritDoc CommandLineParameter.appendToArgList} @override */
    appendToArgList(argList) {
        if (this.values.length > 0) {
            for (const value of this.values) {
                argList.push(this.longName);
                argList.push(value);
            }
        }
    }
}
exports.CommandLineChoiceListParameter = CommandLineChoiceListParameter;
//# sourceMappingURL=CommandLineChoiceListParameter.js.map