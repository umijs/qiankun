import {Plugin} from 'unified' // eslint-disable-line import/no-extraneous-dependencies

// http://docs.mathjax.org/en/latest/options/output/chtml.html#the-configuration-block
interface MathJaxCHtmlOptions {
  scale?: number
  minScale?: number
  matchFontHeight?: boolean
  mtextInheritFont?: boolean
  merrorInheritFont?: boolean
  mathmlSpacing?: boolean
  skipAttributes?: Record<string, boolean>
  exFactor?: number
  displayAlign?: 'left' | 'center' | 'right'
  displayIndent?: string
  fontURL: string
  adaptiveCSS?: boolean
}

// http://docs.mathjax.org/en/latest/options/input/tex.html#the-configuration-block
interface MathJaxInputTexOptions {
  packages: string[]
  inlineMath: [[string, string]]
  displayMath: [[string, string]]
  processEscapes: boolean
  processEnvironments: boolean
  processRefs: boolean
  digits: RegExp
  tags: 'none' | 'ams' | 'all'
  tagSide: 'left' | 'right'
  tagIndent: string
  useLabelIds: boolean
  multlineWidth: string
  maxMacros: number
  maxBuffer: number
  baseURL: string
  formatError: (jax: any, error: any) => string
}

declare const renderCHtml: Plugin<
  [MathJaxCHtmlOptions & {tex?: Partial<MathJaxInputTexOptions>}]
>

export = renderCHtml
