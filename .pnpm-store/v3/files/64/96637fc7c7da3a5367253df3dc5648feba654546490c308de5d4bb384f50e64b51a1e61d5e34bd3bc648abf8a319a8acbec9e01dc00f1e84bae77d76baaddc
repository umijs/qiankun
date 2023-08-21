// TypeScript Version: 3.5

import {Node} from 'unist'
import {Test} from 'unist-util-is'

declare namespace unistUtilFilter {
  /**
   * Options for unist util filter
   */
  interface Options {
    /**
     * Whether to drop parent nodes if they had children,
     * but all their children were filtered out
     *
     * @default true
     */
    cascade?: boolean
  }
}

/**
 * Create a new tree consisting of copies of all nodes that pass test.
 * The tree is walked in preorder (NLR), visiting the node itself, then its head, etc.
 *
 * @param tree Tree to filter
 * @param filter unist-util-is compatible test
 */
declare function unistUtilFilter<T extends Node>(
  tree: Node,
  filter?: Test<T>
): T | null

/**
 * Create a new tree consisting of copies of all nodes that pass test.
 * The tree is walked in preorder (NLR), visiting the node itself, then its head, etc.
 *
 * @param tree Tree to filter
 * @param options additional configuration
 * @param filter unist-util-is compatible test
 */
declare function unistUtilFilter<T extends Node>(
  tree: Node,
  options: unistUtilFilter.Options,
  filter?: Test<T>
): T | null

export = unistUtilFilter
