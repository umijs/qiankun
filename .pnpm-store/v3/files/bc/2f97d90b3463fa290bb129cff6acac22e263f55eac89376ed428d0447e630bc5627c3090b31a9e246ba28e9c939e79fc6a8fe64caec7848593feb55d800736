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
exports.JsonSchema = void 0;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const JsonFile_1 = require("./JsonFile");
const FileSystem_1 = require("./FileSystem");
const Validator = require('z-schema/dist/ZSchema-browser-min');
/**
 * Represents a JSON schema that can be used to validate JSON data files loaded by the JsonFile class.
 * @remarks
 * The schema itself is normally loaded and compiled later, only if it is actually required to validate
 * an input.  To avoid schema errors at runtime, it's recommended to create a unit test that calls
 * JsonSchema.ensureCompiled() for each of your schema objects.
 *
 * @public
 */
class JsonSchema {
    constructor() {
        this._dependentSchemas = [];
        this._filename = '';
        this._validator = undefined;
        this._schemaObject = undefined;
    }
    /**
     * Registers a JsonSchema that will be loaded from a file on disk.
     * @remarks
     * NOTE: An error occurs if the file does not exist; however, the file itself is not loaded or validated
     * until it the schema is actually used.
     */
    static fromFile(filename, options) {
        // This is a quick and inexpensive test to avoid the catch the most common errors early.
        // Full validation will happen later in JsonSchema.compile().
        if (!FileSystem_1.FileSystem.exists(filename)) {
            throw new Error('Schema file not found: ' + filename);
        }
        const schema = new JsonSchema();
        schema._filename = filename;
        if (options) {
            schema._dependentSchemas = options.dependentSchemas || [];
        }
        return schema;
    }
    /**
     * Registers a JsonSchema that will be loaded from a file on disk.
     * @remarks
     * NOTE: An error occurs if the file does not exist; however, the file itself is not loaded or validated
     * until it the schema is actually used.
     */
    static fromLoadedObject(schemaObject) {
        const schema = new JsonSchema();
        schema._schemaObject = schemaObject;
        return schema;
    }
    static _collectDependentSchemas(collectedSchemas, dependentSchemas, seenObjects, seenIds) {
        for (const dependentSchema of dependentSchemas) {
            // It's okay for the same schema to appear multiple times in the tree, but we only process it once
            if (seenObjects.has(dependentSchema)) {
                continue;
            }
            seenObjects.add(dependentSchema);
            const schemaId = dependentSchema._ensureLoaded();
            if (schemaId === '') {
                throw new Error(`This schema ${dependentSchema.shortName} cannot be referenced` +
                    ' because is missing the "id" field');
            }
            if (seenIds.has(schemaId)) {
                throw new Error(`This schema ${dependentSchema.shortName} has the same "id" as another schema in this set`);
            }
            seenIds.add(schemaId);
            collectedSchemas.push(dependentSchema);
            JsonSchema._collectDependentSchemas(collectedSchemas, dependentSchema._dependentSchemas, seenObjects, seenIds);
        }
    }
    /**
     * Used to nicely format the ZSchema error tree.
     */
    static _formatErrorDetails(errorDetails) {
        return JsonSchema._formatErrorDetailsHelper(errorDetails, '', '');
    }
    /**
     * Used by _formatErrorDetails.
     */
    static _formatErrorDetailsHelper(errorDetails, indent, buffer) {
        for (const errorDetail of errorDetails) {
            buffer += os.EOL + indent + `Error: ${errorDetail.path}`;
            if (errorDetail.description) {
                const MAX_LENGTH = 40;
                let truncatedDescription = errorDetail.description.trim();
                if (truncatedDescription.length > MAX_LENGTH) {
                    truncatedDescription = truncatedDescription.substr(0, MAX_LENGTH - 3) + '...';
                }
                buffer += ` (${truncatedDescription})`;
            }
            buffer += os.EOL + indent + `       ${errorDetail.message}`;
            if (errorDetail.inner) {
                buffer = JsonSchema._formatErrorDetailsHelper(errorDetail.inner, indent + '  ', buffer);
            }
        }
        return buffer;
    }
    /**
     * Returns a short name for this schema, for use in error messages.
     * @remarks
     * If the schema was loaded from a file, then the base filename is used.  Otherwise, the "id"
     * field is used if available.
     */
    get shortName() {
        if (!this._filename) {
            if (this._schemaObject) {
                const schemaWithId = this._schemaObject;
                if (schemaWithId.id) {
                    return schemaWithId.id;
                }
            }
            return '(anonymous schema)';
        }
        else {
            return path.basename(this._filename);
        }
    }
    /**
     * If not already done, this loads the schema from disk and compiles it.
     * @remarks
     * Any dependencies will be compiled as well.
     */
    ensureCompiled() {
        this._ensureLoaded();
        if (!this._validator) {
            // Don't assign this to _validator until we're sure everything was successful
            const newValidator = new Validator({
                breakOnFirstError: false,
                noTypeless: true,
                noExtraKeywords: true
            });
            const anythingSchema = {
                type: ['array', 'boolean', 'integer', 'number', 'object', 'string']
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newValidator.setRemoteReference('http://json-schema.org/draft-04/schema', anythingSchema);
            const collectedSchemas = [];
            const seenObjects = new Set();
            const seenIds = new Set();
            JsonSchema._collectDependentSchemas(collectedSchemas, this._dependentSchemas, seenObjects, seenIds);
            // Validate each schema in order.  We specifically do not supply them all together, because we want
            // to make sure that circular references will fail to validate.
            for (const collectedSchema of collectedSchemas) {
                if (!newValidator.validateSchema(collectedSchema._schemaObject)) {
                    throw new Error(`Failed to validate schema "${collectedSchema.shortName}":` +
                        os.EOL +
                        JsonSchema._formatErrorDetails(newValidator.getLastErrors()));
                }
            }
            this._validator = newValidator;
        }
    }
    /**
     * Validates the specified JSON object against this JSON schema.  If the validation fails,
     * an exception will be thrown.
     * @param jsonObject - The JSON data to be validated
     * @param filenameForErrors - The filename that the JSON data was available, or an empty string
     *    if not applicable
     * @param options - Other options that control the validation
     */
    validateObject(jsonObject, filenameForErrors, options) {
        this.validateObjectWithCallback(jsonObject, (errorInfo) => {
            const prefix = options && options.customErrorHeader ? options.customErrorHeader : 'JSON validation failed:';
            throw new Error(prefix + os.EOL + filenameForErrors + os.EOL + errorInfo.details);
        });
    }
    /**
     * Validates the specified JSON object against this JSON schema.  If the validation fails,
     * a callback is called for each validation error.
     */
    validateObjectWithCallback(jsonObject, errorCallback) {
        this.ensureCompiled();
        if (!this._validator.validate(jsonObject, this._schemaObject)) {
            const errorDetails = JsonSchema._formatErrorDetails(this._validator.getLastErrors());
            const args = {
                details: errorDetails
            };
            errorCallback(args);
        }
    }
    _ensureLoaded() {
        if (!this._schemaObject) {
            this._schemaObject = JsonFile_1.JsonFile.load(this._filename);
        }
        return this._schemaObject.id || '';
    }
}
exports.JsonSchema = JsonSchema;
//# sourceMappingURL=JsonSchema.js.map