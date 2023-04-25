/**
 * @author Kuitos
 * @since 2023-04-25
 */
import { loadEntry } from '@qiankunjs/loader';
import { Sandbox, transpileAssets } from '@qiankunjs/sandbox';
import type { ParcelConfigObject } from 'single-spa';
import type { AppConfiguration, LifeCycles, LoadableApp, ObjectType } from './types';

export type ParcelConfigObjectGetter = (remountContainer?: string | HTMLElement) => ParcelConfigObject;

export default async function load<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
) {
  const { entry, container } = app;
  const { fetch, sandbox } = configuration || {};

  console.log(lifeCycles);

  return loadEntry(entry as string, container as HTMLElement, {
    nodeTransformer: sandbox
      ? (node: Node) => {
          transpileAssets(node, entry, { fetch, compartment: new Sandbox() });
          return node;
        }
      : undefined,
  });
}
