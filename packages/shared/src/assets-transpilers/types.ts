/**
 * @author Kuitos
 * @since 2023-08-26
 */
import type { BaseLoaderOpts } from '../common';

import type { MatchResult } from '../module-resolver';

export type BaseTranspilerOpts = BaseLoaderOpts & { moduleResolver?: (url: string) => MatchResult | undefined };

export type AssetsTranspilerOpts = BaseTranspilerOpts & { rawNode: Node };
