import type { PluginCreator } from 'postcss';
import type { ImportOptions, ExportOptions } from './lib/options';
export interface PluginOptions {
    /** Do not emit warnings about "importFrom" and "exportTo" deprecations */
    disableDeprecationNotice?: boolean;
    /** Determines whether Custom Properties and properties using custom properties should be preserved in their original form. */
    preserve?: boolean;
    /** Specifies sources where Custom Properties can be imported from, which might be CSS, JS, and JSON files, functions, and directly passed objects. */
    importFrom?: ImportOptions | Array<ImportOptions>;
    /** Specifies destinations where Custom Properties can be exported to, which might be CSS, JS, and JSON files, functions, and directly passed objects. */
    exportTo?: ExportOptions | Array<ExportOptions>;
    /** Specifies if `importFrom` properties or `:root` properties have priority. */
    overrideImportFromWithRoot?: boolean;
}
declare const creator: PluginCreator<PluginOptions>;
export default creator;
