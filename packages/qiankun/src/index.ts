import { loadEntry } from '@qiankunjs/loader';
import { transpileAssets, Sandbox } from '@qiankunjs/sandbox';

export type ObjectType = Record<string, any>;

export type Entry = string;

type AppMetadata = {
  // app name
  name: string;
  // app entry
  entry: Entry;
};

// just for manual loaded apps, in single-spa it called parcel
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  // where the app mount to, mutual exclusive with the legacy custom render function
  container: string | HTMLElement;
  // props pass to app
  props?: T;
};

type AppConfiguration = {
  fetch?: typeof window.fetch;
};

export async function loadMicroApp<T extends ObjectType>(app: LoadableApp<T>, configuration?: AppConfiguration) {
  const { entry, container } = app;
  const { fetch } = configuration || {};

  await loadEntry(entry as string, container as HTMLElement, {
    nodeTransformer: (node: Node) => {
      transpileAssets(node, entry, { fetch, compartment: new Sandbox() });
      return node;
    },
  });
}
