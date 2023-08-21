"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringBufferTerminalProvider = void 0;
const ITerminalProvider_1 = require("./ITerminalProvider");
const StringBuilder_1 = require("../StringBuilder");
const Text_1 = require("../Text");
const AnsiEscape_1 = require("./AnsiEscape");
/**
 * Terminal provider that stores written data in buffers separated by severity.
 * This terminal provider is designed to be used when code that prints to a terminal
 * is being unit tested.
 *
 * @beta
 */
class StringBufferTerminalProvider {
    constructor(supportsColor = false) {
        this._standardBuffer = new StringBuilder_1.StringBuilder();
        this._verboseBuffer = new StringBuilder_1.StringBuilder();
        this._debugBuffer = new StringBuilder_1.StringBuilder();
        this._warningBuffer = new StringBuilder_1.StringBuilder();
        this._errorBuffer = new StringBuilder_1.StringBuilder();
        this._supportsColor = supportsColor;
    }
    /**
     * {@inheritDoc ITerminalProvider.write}
     */
    write(data, severity) {
        switch (severity) {
            case ITerminalProvider_1.TerminalProviderSeverity.warning: {
                this._warningBuffer.append(data);
                break;
            }
            case ITerminalProvider_1.TerminalProviderSeverity.error: {
                this._errorBuffer.append(data);
                break;
            }
            case ITerminalProvider_1.TerminalProviderSeverity.verbose: {
                this._verboseBuffer.append(data);
                break;
            }
            case ITerminalProvider_1.TerminalProviderSeverity.debug: {
                this._debugBuffer.append(data);
                break;
            }
            case ITerminalProvider_1.TerminalProviderSeverity.log:
            default: {
                this._standardBuffer.append(data);
                break;
            }
        }
    }
    /**
     * {@inheritDoc ITerminalProvider.eolCharacter}
     */
    get eolCharacter() {
        return '[n]';
    }
    /**
     * {@inheritDoc ITerminalProvider.supportsColor}
     */
    get supportsColor() {
        return this._supportsColor;
    }
    /**
     * Get everything that has been written at log-level severity.
     */
    getOutput(options) {
        return this._normalizeOutput(this._standardBuffer.toString(), options);
    }
    /**
     * Get everything that has been written at verbose-level severity.
     */
    getVerbose(options) {
        return this._normalizeOutput(this._verboseBuffer.toString(), options);
    }
    /**
     * Get everything that has been written at debug-level severity.
     */
    getDebugOutput(options) {
        return this._normalizeOutput(this._debugBuffer.toString(), options);
    }
    /**
     * Get everything that has been written at error-level severity.
     */
    getErrorOutput(options) {
        return this._normalizeOutput(this._errorBuffer.toString(), options);
    }
    /**
     * Get everything that has been written at warning-level severity.
     */
    getWarningOutput(options) {
        return this._normalizeOutput(this._warningBuffer.toString(), options);
    }
    _normalizeOutput(s, options) {
        options = Object.assign({ normalizeSpecialCharacters: true }, (options || {}));
        s = Text_1.Text.convertToLf(s);
        if (options.normalizeSpecialCharacters) {
            return AnsiEscape_1.AnsiEscape.formatForTests(s, { encodeNewlines: true });
        }
        else {
            return s;
        }
    }
}
exports.StringBufferTerminalProvider = StringBufferTerminalProvider;
//# sourceMappingURL=StringBufferTerminalProvider.js.map