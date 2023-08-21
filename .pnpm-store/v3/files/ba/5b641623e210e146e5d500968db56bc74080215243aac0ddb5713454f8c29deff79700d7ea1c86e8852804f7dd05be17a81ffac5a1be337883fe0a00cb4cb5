// TypeScript Version: 3.0

import {Node, Parent, Position} from 'unist'
import {Parser, Plugin} from 'unified'

declare class RemarkParser implements Parser {
  parse(): Node
  blockMethods: string[]
  inlineTokenizers: {
    [key: string]: remarkParse.Tokenizer
  }
  inlineMethods: string[]
}

declare namespace remarkParse {
  interface Parse extends Plugin<[Partial<RemarkParseOptions>?]> {
    (options: Partial<RemarkParseOptions>): void
    Parser: typeof RemarkParser
  }

  type Parser = RemarkParser

  interface RemarkParseOptions {
    gfm: boolean
    commonmark: boolean
    footnotes: boolean
    blocks: string[]
    pedantic: boolean
  }

  interface Add {
    (node: Node, parent?: Parent): Node
    test(): Position
    reset(node: Node, parent?: Node): Node
  }

  type Eat = (value: string) => Add

  type Locator = (value: string, fromIndex: number) => number

  interface Tokenizer {
    (eat: Eat, value: string, silent: true): boolean | void
    (eat: Eat, value: string): Node | void
    locator?: Locator
    onlyAtStart?: boolean
    notInBlock?: boolean
    notInList?: boolean
    notInLink?: boolean
  }
}
declare const remarkParse: remarkParse.Parse

export = remarkParse
