/**
 * @author Kuitos
 * @since 2023-08-26
 */
import type { Sandbox } from '@qiankunjs/sandbox';
import type { BaseLoaderOpts } from '../common';

import type { MatchResult } from '../module-resolver';

export type BaseTranspilerOpts = BaseLoaderOpts & {
  moduleResolver?: (url: string) => MatchResult | undefined;
  sandbox?: Sandbox;
};

export type AssetsTranspilerOpts = BaseTranspilerOpts & { rawNode: Node };

export enum Mode {
  REMOTE_ASSETS_IN_SANDBOX = 'RAIS',
  REUSED_DEP_IN_SANDBOX = 'RDIS',
  INLINE_CODE_IN_SANDBOX = 'ICIS',
  NONE = 'NONE',
}
