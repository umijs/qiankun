import { JsonObject } from './JsonFile';
/**
 * Callback function arguments for JsonSchema.validateObjectWithCallback();
 * @public
 */
export interface IJsonSchemaErrorInfo {
    /**
     * The z-schema error tree, formatted as an indented text string.
     */
    details: string;
}
/**
 * Options for JsonSchema.validateObject()
 * @public
 */
export interface IJsonSchemaValidateOptions {
    /**
     * A custom header that will be used to report schema errors.
     * @remarks
     * If omitted, the default header is "JSON validation failed:".  The error message starts with
     * the header, followed by the full input filename, followed by the z-schema error tree.
     * If you wish to customize all aspects of the error message, use JsonFile.loadAndValidateWithCallback()
     * or JsonSchema.validateObjectWithCallback().
     */
    customErrorHeader?: string;
}
/**
 * Options for JsonSchema.fromFile()
 * @public
 */
export interface IJsonSchemaFromFileOptions {
    /**
     * Other schemas that this schema references, e.g. via the "$ref" directive.
     * @remarks
     * The tree of dependent schemas may reference the same schema more than once.
     * However, if the same schema "id" is used by two different JsonSchema instances,
     * an error will be reported.  This means you cannot load the same filename twice
     * and use them both together, and you cannot have diamond dependencies on different
     * versions of the same schema.  Although technically this would be possible to support,
     * it normally indicates an error or design problem.
     *
     * JsonSchema also does not allow circular references between schema dependencies.
     */
    dependentSchemas?: JsonSchema[];
}
/**
 * Represents a JSON schema that can be used to validate JSON data files loaded by the JsonFile class.
 * @remarks
 * The schema itself is normally loaded and compiled later, only if it is actually required to validate
 * an input.  To avoid schema errors at runtime, it's recommended to create a unit test that calls
 * JsonSchema.ensureCompiled() for each of your schema objects.
 *
 * @public
 */
export declare class JsonSchema {
    private _dependentSchemas;
    private _filename;
    private _validator;
    private _schemaObject;
    private constructor();
    /**
     * Registers a JsonSchema that will be loaded from a file on disk.
     * @remarks
     * NOTE: An error occurs if the file does not exist; however, the file itself is not loaded or validated
     * until it the schema is actually used.
     */
    static fromFile(filename: string, options?: IJsonSchemaFromFileOptions): JsonSchema;
    /**
     * Registers a JsonSchema that will be loaded from a file on disk.
     * @remarks
     * NOTE: An error occurs if the file does not exist; however, the file itself is not loaded or validated
     * until it the schema is actually used.
     */
    static fromLoadedObject(schemaObject: JsonObject): JsonSchema;
    private static _collectDependentSchemas;
    /**
     * Used to nicely format the ZSchema error tree.
     */
    private static _formatErrorDetails;
    /**
     * Used by _formatErrorDetails.
     */
    private static _formatErrorDetailsHelper;
    /**
     * Returns a short name for this schema, for use in error messages.
     * @remarks
     * If the schema was loaded from a file, then the base filename is used.  Otherwise, the "id"
     * field is used if available.
     */
    get shortName(): string;
    /**
     * If not already done, this loads the schema from disk and compiles it.
     * @remarks
     * Any dependencies will be compiled as well.
     */
    ensureCompiled(): void;
    /**
     * Validates the specified JSON object against this JSON schema.  If the validation fails,
     * an exception will be thrown.
     * @param jsonObject - The JSON data to be validated
     * @param filenameForErrors - The filename that the JSON data was available, or an empty string
     *    if not applicable
     * @param options - Other options that control the validation
     */
    validateObject(jsonObject: JsonObject, filenameForErrors: string, options?: IJsonSchemaValidateOptions): void;
    /**
     * Validates the specified JSON object against this JSON schema.  If the validation fails,
     * a callback is called for each validation error.
     */
    validateObjectWithCallback(jsonObject: JsonObject, errorCallback: (errorInfo: IJsonSchemaErrorInfo) => void): void;
    private _ensureLoaded;
}
//# sourceMappingURL=JsonSchema.d.ts.map