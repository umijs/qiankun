/**
 * @author Kuitos
 * @since 2023-08-26
 */
import type { BaseLoaderOpts } from '../common';
import type { MatchResult } from '../module-resolver';
import type { Deferred } from '../utils';

export type BaseTranspilerOpts = BaseLoaderOpts & {
  moduleResolver?: (url: string) => MatchResult | undefined;
  sandbox?: {
    makeEvaluateFactory(source: string, sourceURL?: string): string;
  };
};

export type AssetsTranspilerOpts = BaseTranspilerOpts & { rawNode: Node };

export type ScriptTranspilerOpts = AssetsTranspilerOpts &
  (
    | { prevSyncScriptPromise: Promise<void>; scriptFetchedDeferred: Deferred<void> }
    | { prevSyncScriptPromise?: undefined; scriptFetchedDeferred?: undefined }
  );

export enum Mode {
  REMOTE_ASSETS_IN_SANDBOX = 'RAIS',
  REUSED_DEP_IN_SANDBOX = 'RDIS',
  INLINE_CODE_IN_SANDBOX = 'ICIS',
  NONE = 'NONE',
}
