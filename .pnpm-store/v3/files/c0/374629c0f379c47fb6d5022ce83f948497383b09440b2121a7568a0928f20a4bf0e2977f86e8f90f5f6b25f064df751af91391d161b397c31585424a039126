"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabCompleteAction = void 0;
const string_argv_1 = __importDefault(require("string-argv"));
const BaseClasses_1 = require("../parameters/BaseClasses");
const CommandLineChoiceParameter_1 = require("../parameters/CommandLineChoiceParameter");
const CommandLineAction_1 = require("./CommandLineAction");
const DEFAULT_WORD_TO_AUTOCOMPLETE = '';
const DEFAULT_POSITION = 0;
class TabCompleteAction extends CommandLineAction_1.CommandLineAction {
    constructor(actions, globalParameters) {
        super({
            actionName: "tab-complete" /* CommandLineConstants.TabCompletionActionName */,
            summary: 'Provides tab completion.',
            documentation: 'Provides tab completion.'
        });
        this._actions = new Map();
        for (const action of actions) {
            const parameterNameToParameterInfoMap = new Map();
            for (const parameter of action.parameters) {
                parameterNameToParameterInfoMap.set(parameter.longName, parameter);
                if (parameter.shortName) {
                    parameterNameToParameterInfoMap.set(parameter.shortName, parameter);
                }
            }
            this._actions.set(action.actionName, parameterNameToParameterInfoMap);
        }
        this._globalParameters = new Map();
        for (const parameter of globalParameters) {
            this._globalParameters.set(parameter.longName, parameter);
            if (parameter.shortName) {
                this._globalParameters.set(parameter.shortName, parameter);
            }
        }
        this._wordToCompleteParameter = this.defineStringParameter({
            parameterLongName: '--word',
            argumentName: 'WORD',
            description: `The word to complete.`,
            defaultValue: DEFAULT_WORD_TO_AUTOCOMPLETE
        });
        this._positionParameter = this.defineIntegerParameter({
            parameterLongName: '--position',
            argumentName: 'INDEX',
            description: `The position in the word to be completed.`,
            defaultValue: DEFAULT_POSITION
        });
    }
    async onExecute() {
        var _a, e_1, _b, _c;
        const commandLine = this._wordToCompleteParameter.value || '';
        const caretPosition = this._positionParameter.value || (commandLine && commandLine.length) || 0;
        try {
            for (var _d = true, _e = __asyncValues(this.getCompletions(commandLine, caretPosition)), _f; _f = await _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const value = _c;
                    console.log(value);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    getCompletions(commandLine, caretPosition = commandLine.length) {
        return __asyncGenerator(this, arguments, function* getCompletions_1() {
            const actions = this._actions;
            if (!commandLine || !caretPosition) {
                yield __await(yield* __asyncDelegator(__asyncValues(this._getAllActions())));
                return yield __await(void 0);
            }
            const tokens = Array.from(this.tokenizeCommandLine(commandLine));
            // offset arguments by the number of global params in the input
            const globalParameterOffset = this._getGlobalParameterOffset(tokens);
            if (tokens.length < 2 + globalParameterOffset) {
                yield __await(yield* __asyncDelegator(__asyncValues(this._getAllActions())));
                return yield __await(void 0);
            }
            const lastToken = tokens[tokens.length - 1];
            const secondLastToken = tokens[tokens.length - 2];
            const completePartialWord = caretPosition === commandLine.length;
            if (completePartialWord && tokens.length === 2 + globalParameterOffset) {
                for (const actionName of actions.keys()) {
                    if (actionName.indexOf(tokens[1 + globalParameterOffset]) === 0) {
                        yield yield __await(actionName);
                    }
                }
            }
            else {
                for (const actionName of actions.keys()) {
                    if (actionName === tokens[1 + globalParameterOffset]) {
                        const parameterNameMap = actions.get(actionName);
                        const parameterNames = Array.from(parameterNameMap.keys());
                        if (completePartialWord) {
                            for (const parameterName of parameterNames) {
                                if (parameterName === secondLastToken) {
                                    const values = yield __await(this._getParameterValueCompletions(parameterNameMap.get(parameterName)));
                                    if (values.length > 0) {
                                        yield __await(yield* __asyncDelegator(__asyncValues(this._completeParameterValues(values, lastToken))));
                                        return yield __await(void 0);
                                    }
                                }
                            }
                            yield __await(yield* __asyncDelegator(__asyncValues(this._completeParameterValues(parameterNames, lastToken))));
                        }
                        else {
                            for (const parameterName of parameterNames) {
                                if (parameterName === lastToken) {
                                    const values = yield __await(this._getParameterValueCompletions(parameterNameMap.get(parameterName)));
                                    if (values.length > 0) {
                                        yield __await(yield* __asyncDelegator(__asyncValues(values)));
                                        return yield __await(void 0);
                                    }
                                }
                            }
                            for (const parameterName of parameterNames) {
                                if (parameterName === lastToken &&
                                    parameterNameMap.get(parameterName).kind !== BaseClasses_1.CommandLineParameterKind.Flag) {
                                    // The parameter is expecting a value, so don't suggest parameter names again
                                    return yield __await(void 0);
                                }
                            }
                            yield __await(yield* __asyncDelegator(__asyncValues(parameterNames)));
                        }
                        break;
                    }
                }
            }
        });
    }
    *_getAllActions() {
        yield* this._actions.keys();
        yield* this._globalParameters.keys();
    }
    tokenizeCommandLine(commandLine) {
        return (0, string_argv_1.default)(commandLine);
    }
    async _getParameterValueCompletions(parameter) {
        let choiceParameterValues = [];
        if (parameter.kind === BaseClasses_1.CommandLineParameterKind.Choice) {
            choiceParameterValues = parameter.alternatives;
        }
        else if (parameter.kind !== BaseClasses_1.CommandLineParameterKind.Flag) {
            let parameterWithArgumentOrChoices = undefined;
            if (parameter instanceof BaseClasses_1.CommandLineParameterWithArgument) {
                parameterWithArgumentOrChoices = parameter;
            }
            else if (parameter instanceof CommandLineChoiceParameter_1.CommandLineChoiceParameter) {
                parameterWithArgumentOrChoices = parameter;
            }
            if (parameterWithArgumentOrChoices && parameterWithArgumentOrChoices.completions) {
                choiceParameterValues = await parameterWithArgumentOrChoices.completions();
            }
        }
        return choiceParameterValues;
    }
    _getGlobalParameterOffset(tokens) {
        const globalParameters = this._globalParameters;
        let count = 0;
        outer: for (let i = 1; i < tokens.length; i++) {
            for (const globalParameter of globalParameters.values()) {
                if (tokens[i] !== globalParameter.longName && tokens[i] !== globalParameter.shortName) {
                    break outer;
                }
            }
            count++;
        }
        return count;
    }
    *_completeParameterValues(choiceParameterValues, lastToken) {
        for (const choiceParameterValue of choiceParameterValues) {
            if (choiceParameterValue.indexOf(lastToken) === 0) {
                yield choiceParameterValue;
            }
        }
    }
}
exports.TabCompleteAction = TabCompleteAction;
//# sourceMappingURL=TabCompletionAction.js.map