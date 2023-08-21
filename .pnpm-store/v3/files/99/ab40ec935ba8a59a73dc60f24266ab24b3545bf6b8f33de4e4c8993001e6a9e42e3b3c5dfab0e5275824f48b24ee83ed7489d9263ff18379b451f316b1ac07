"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractorMessage = void 0;
const SourceFileLocationFormatter_1 = require("../analyzer/SourceFileLocationFormatter");
/**
 * This object is used to report an error or warning that occurred during API Extractor's analysis.
 *
 * @public
 */
class ExtractorMessage {
    /** @internal */
    constructor(options) {
        this.category = options.category;
        this.messageId = options.messageId;
        this.text = options.text;
        this.sourceFilePath = options.sourceFilePath;
        this.sourceFileLine = options.sourceFileLine;
        this.sourceFileColumn = options.sourceFileColumn;
        this.properties = options.properties || {};
        this._handled = false;
        this._logLevel = options.logLevel || "none" /* ExtractorLogLevel.None */;
    }
    /**
     * If the {@link IExtractorInvokeOptions.messageCallback} sets this property to true, it will prevent the message
     * from being displayed by API Extractor.
     *
     * @remarks
     * If the `messageCallback` routes the message to a custom handler (e.g. a toolchain logger), it should
     * assign `handled = true` to prevent API Extractor from displaying it.  Assigning `handled = true` for all messages
     * would effectively disable all console output from the `Extractor` API.
     *
     * If `handled` is set to true, the message will still be included in the count of errors/warnings;
     * to discard a message entirely, instead assign `logLevel = none`.
     */
    get handled() {
        return this._handled;
    }
    set handled(value) {
        if (this._handled && !value) {
            throw new Error('One a message has been marked as handled, the "handled" property cannot be set to false');
        }
        this._handled = value;
    }
    /**
     * Specifies how the message should be reported.
     *
     * @remarks
     * If the {@link IExtractorInvokeOptions.messageCallback} handles the message (i.e. sets `handled = true`),
     * it can use the `logLevel` to determine how to display the message.
     *
     * Alternatively, if API Extractor is handling the message, the `messageCallback` could assign `logLevel` to change
     * how it will be processed.  However, in general the recommended practice is to configure message routing
     * using the `messages` section in api-extractor.json.
     *
     * To discard a message entirely, assign `logLevel = none`.
     */
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(value) {
        switch (value) {
            case "error" /* ExtractorLogLevel.Error */:
            case "info" /* ExtractorLogLevel.Info */:
            case "none" /* ExtractorLogLevel.None */:
            case "verbose" /* ExtractorLogLevel.Verbose */:
            case "warning" /* ExtractorLogLevel.Warning */:
                break;
            default:
                throw new Error('Invalid log level');
        }
        this._logLevel = value;
    }
    /**
     * Returns the message formatted with its identifier and file position.
     * @remarks
     * Example:
     * ```
     * src/folder/File.ts:123:4 - (ae-extra-release-tag) The doc comment should not contain more than one release tag.
     * ```
     */
    formatMessageWithLocation(workingPackageFolderPath) {
        let result = '';
        if (this.sourceFilePath) {
            result += SourceFileLocationFormatter_1.SourceFileLocationFormatter.formatPath(this.sourceFilePath, {
                sourceFileLine: this.sourceFileLine,
                sourceFileColumn: this.sourceFileColumn,
                workingPackageFolderPath
            });
            if (result.length > 0) {
                result += ' - ';
            }
        }
        result += this.formatMessageWithoutLocation();
        return result;
    }
    formatMessageWithoutLocation() {
        return `(${this.messageId}) ${this.text}`;
    }
}
exports.ExtractorMessage = ExtractorMessage;
//# sourceMappingURL=ExtractorMessage.js.map