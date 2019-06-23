/**
 * @author kuitos
 * @since 2019-05-16
 */

export type render = (props: { appContent: string, loading: boolean }) => any;
export type Entry = string | {
  scripts?: string[];
  styles?: string[];
  html?: string;
};

export type RegistrableApp<T extends object = {}> = {
  name: string; // app name
  entry: Entry;  // app entry
  render: render;
  activeRule: (location: Location) => boolean;
  props?: T; // props pass through to app
};

export type StartOpts = {
  prefetch?: boolean;
  jsSandbox?: boolean;
};

export type Rebuilder = () => void;
export type Freer = () => Rebuilder;
