import type { PluginOption } from 'vite';

export declare const qiankunDevHtmlPath: '/__qiankun_dev__.html';
export declare const qiankunDevScriptPath: '/__qiankun_dev__.js';
export declare const qiankunDevModulePath: '/__qiankun_dev_module__';

export interface QiankunDevEntryHtmlOptions {
  rootId: string;
}

export interface QiankunDevEntryScriptOptions {
  appName: string;
  moduleEntry: string;
}

export interface QiankunDevPluginOptions extends QiankunDevEntryHtmlOptions, QiankunDevEntryScriptOptions {}

export declare function createQiankunDevEntryHtml(options: QiankunDevEntryHtmlOptions): string;
export declare function createQiankunDevEntryScript(options: QiankunDevEntryScriptOptions): string;
export declare function transformViteDevModule(code: string, moduleId: string): string;
export declare function qiankunDevEntryPlugin(options: QiankunDevPluginOptions): PluginOption;
