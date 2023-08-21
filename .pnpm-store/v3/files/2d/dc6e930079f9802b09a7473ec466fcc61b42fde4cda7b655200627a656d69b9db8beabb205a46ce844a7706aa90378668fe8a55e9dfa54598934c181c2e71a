/**
 * patcher for api-extractor, to support legacy export = syntax
 * @reason https://github.com/microsoft/rushstack/issues/2220
 * @solution hijack tsHost.readFile for the CompilerState of api-extractor
 *           to replace legacy export = [Specifier] to export { [Specifier] as default }
 *           and re-export all types within exported namespace
 */
export {};
