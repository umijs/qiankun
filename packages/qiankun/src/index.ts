import { importEntry } from '@qiankunjs/loader';

export type ObjectType = Record<string, any>;

export type Entry =
  | string
  | {
      scripts?: string[];
      styles?: string[];
      html?: string;
    };

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

export async function loadMicroApp<T extends ObjectType>(app: LoadableApp<T>) {
  const { entry, container } = app;
  await importEntry(entry, container);
}
