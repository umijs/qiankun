// Minimum TypeScript Version: 3.2
import {Plugin} from 'unified' // eslint-disable-line import/no-extraneous-dependencies

// Should be ported back to MathJax repo
// http://docs.mathjax.org/en/latest/options/output/svg.html#the-configuration-block
interface MathJaxSvgOptions {
  scale: number
  minScale: number
  mtextInheritFont: boolean
  merrorInheritFont: boolean
  mathmlSpacing: boolean
  skipAttributes: Record<string, boolean>
  exFactor: number
  displayAlign: 'left' | 'center' | 'right'
  displayIndent: string
  fontCache: 'local' | 'global'
  localID: string | null
  internalSpeechTitles: true
  titleID: number
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

type RenderSVGOptions = Partial<MathJaxSvgOptions>

declare const renderSvg: Plugin<
  [(RenderSVGOptions & {tex?: Partial<MathJaxInputTexOptions>})?]
>

export = renderSvg
