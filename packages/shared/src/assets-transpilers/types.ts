/**
 * @author Kuitos
 * @since 2023-08-26
 */
import type { BaseLoaderOpts } from '../common';

import type { MatchResult } from '../module-resolver';

export type BaseTranspilerOpts = BaseLoaderOpts & { moduleResolver?: (url: string) => MatchResult | undefined };

export type AssetsTranspilerOpts = BaseTranspilerOpts & { rawNode: Node };

export enum Mode {
  REMOTE_FROM_SANDBOX = 'REMOTE_FROM_SANDBOX',
  CACHE_FROM_SANDBOX = 'CACHE_IN_SANDBOX',
  INLINE_FROM_SANDBOX = 'INLINE_FROM_SANDBOX',
  NONE = 'NONE',
}
