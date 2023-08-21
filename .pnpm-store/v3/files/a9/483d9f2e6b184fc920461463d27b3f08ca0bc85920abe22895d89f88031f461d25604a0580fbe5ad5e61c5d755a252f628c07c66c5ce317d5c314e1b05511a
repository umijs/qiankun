"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLineAction = void 0;
const CommandLineParameterProvider_1 = require("./CommandLineParameterProvider");
/**
 * Example: "do-something"
 */
const ACTION_NAME_REGEXP = /^[a-z][a-z0-9]*([-:][a-z0-9]+)*$/;
/**
 * Represents a sub-command that is part of the CommandLineParser command line.
 * Applications should create subclasses of CommandLineAction corresponding to
 * each action that they want to expose.
 *
 * The action name should be comprised of lower case words separated by hyphens
 * or colons. The name should include an English verb (e.g. "deploy"). Use a
 * hyphen to separate words (e.g. "upload-docs"). A group of related commands
 * can be prefixed with a colon (e.g. "docs:generate", "docs:deploy",
 * "docs:serve", etc).
 *
 * @public
 */
class CommandLineAction extends CommandLineParameterProvider_1.CommandLineParameterProvider {
    constructor(options) {
        super();
        if (!ACTION_NAME_REGEXP.test(options.actionName)) {
            throw new Error(`Invalid action name "${options.actionName}". ` +
                `The name must be comprised of lower-case words optionally separated by hyphens or colons.`);
        }
        this.actionName = options.actionName;
        this.summary = options.summary;
        this.documentation = options.documentation;
        this._argumentParser = undefined;
    }
    /**
     * This is called internally by CommandLineParser.addAction()
     * @internal
     */
    _buildParser(actionsSubParser) {
        var _a;
        this._argumentParser = actionsSubParser.addParser(this.actionName, {
            help: this.summary,
            description: this.documentation
        });
        (_a = this.onDefineParameters) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    /**
     * This is called internally by CommandLineParser.execute()
     * @internal
     */
    _processParsedData(parserOptions, data) {
        super._processParsedData(parserOptions, data);
    }
    /**
     * Invoked by CommandLineParser.onExecute().
     * @internal
     */
    _execute() {
        return this.onExecute();
    }
    /**
     * {@inheritDoc CommandLineParameterProvider._getArgumentParser}
     * @internal
     */
    _getArgumentParser() {
        // override
        if (!this._argumentParser) {
            // We will improve this in the future
            throw new Error('The CommandLineAction must be added to a CommandLineParser before it can be used');
        }
        return this._argumentParser;
    }
}
exports.CommandLineAction = CommandLineAction;
//# sourceMappingURL=CommandLineAction.js.map