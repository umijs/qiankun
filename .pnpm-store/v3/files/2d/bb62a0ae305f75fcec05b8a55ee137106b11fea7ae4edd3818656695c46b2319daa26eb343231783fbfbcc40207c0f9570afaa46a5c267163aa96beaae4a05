"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleTerminalProvider = void 0;
const os_1 = require("os");
const safe_1 = require("colors/safe");
const ITerminalProvider_1 = require("./ITerminalProvider");
/**
 * Terminal provider that prints to STDOUT (for log- and verbose-level messages) and
 * STDERR (for warning- and error-level messsages).
 *
 * @beta
 */
class ConsoleTerminalProvider {
    constructor(options = {}) {
        /**
         * If true, verbose-level messages should be written to the console.
         */
        this.verboseEnabled = false;
        /**
         * If true, debug-level messages should be written to the console.
         */
        this.debugEnabled = false;
        this.verboseEnabled = !!options.verboseEnabled;
        this.debugEnabled = !!options.debugEnabled;
    }
    /**
     * {@inheritDoc ITerminalProvider.write}
     */
    write(data, severity) {
        switch (severity) {
            case ITerminalProvider_1.TerminalProviderSeverity.warning:
            case ITerminalProvider_1.TerminalProviderSeverity.error: {
                process.stderr.write(data);
                break;
            }
            case ITerminalProvider_1.TerminalProviderSeverity.verbose: {
                if (this.verboseEnabled) {
                    process.stdout.write(data);
                }
                break;
            }
            case ITerminalProvider_1.TerminalProviderSeverity.debug: {
                if (this.debugEnabled) {
                    process.stdout.write(data);
                }
                break;
            }
            case ITerminalProvider_1.TerminalProviderSeverity.log:
            default: {
                process.stdout.write(data);
                break;
            }
        }
    }
    /**
     * {@inheritDoc ITerminalProvider.eolCharacter}
     */
    get eolCharacter() {
        return os_1.EOL;
    }
    /**
     * {@inheritDoc ITerminalProvider.supportsColor}
     */
    get supportsColor() {
        return safe_1.enabled;
    }
}
exports.ConsoleTerminalProvider = ConsoleTerminalProvider;
//# sourceMappingURL=ConsoleTerminalProvider.js.map