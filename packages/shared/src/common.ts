import type { Sandbox } from '@qiankunjs/sandbox';

export type BaseLoaderOpts = {
  fetch: typeof window.fetch;
  sandbox?: Sandbox;
};
