import { globalsInES2015 } from '../globals';

export type ClassicScriptFactory = (view: WindowProxy) => (this: WindowProxy) => void;

/** Instance-independent preparation, consumed synchronously without waiting for compilation. */
export interface ClassicScriptPreparation {
  get(source: string, url: string, globalNames: readonly string[]): ClassicScriptFactory | undefined;
}

export const defaultClassicGlobalNames = globalsInES2015.concat(['requestAnimationFrame', 'cancelAnimationFrame']);
export const standardClassicGlobalNames = [
  'window',
  'self',
  'globalThis',
  'hasOwnProperty',
  'eval',
  'top',
  'parent',
  'document',
];
export const testOnlyClassicGlobalNames = ['mockSafariTop', 'mockTop', 'mockGlobalThis'];

export function getStandardClassicGlobalNames(): string[] {
  const names = standardClassicGlobalNames.concat(process.env.NODE_ENV === 'test' ? testOnlyClassicGlobalNames : []);
  return names.concat(defaultClassicGlobalNames.filter((name) => !names.includes(name)));
}

export function classicScriptBody(source: string, url: string | undefined, names: readonly string[]): string {
  const globals = names.length ? `const {${names.join(',')}} = this;` : '';
  const sourceURL = url ? `//# sourceURL=${url}\n` : '';
  return `with(this){${globals}${source}\n${sourceURL}}`;
}

export interface ScriptSource {
  readonly source: string;
  readonly url: string;
  readonly globalNames: readonly string[];
  readonly factorySource: string;
}

/** Prepare source only: this neither creates a sandbox nor executes application code. */
export function precompileScriptSource(source: string, url: string): ScriptSource {
  const globalNames = Object.freeze(getStandardClassicGlobalNames());
  return Object.freeze({
    source,
    url,
    globalNames,
    factorySource: `(function(compartmentGlobalThis){if(!compartmentGlobalThis){return;}return(function(){${classicScriptBody(source, url, globalNames)}});})`,
  });
}
