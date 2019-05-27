/**
 * @author kuitos
 * @since 2019-05-16
 */

type render = (props?: { appContent: string, loading: boolean }) => any;
export type RegistrableApp = {
  name: string; // app name
  entry: Entry;  // app entry
  render: render;
  activeRule: (location: Location) => boolean;
  props?: object; // props pass through to app
};

export type Entry = string | {
  scripts?: string[];
  styles?: string[];
  html?: string;
};

export type StartOpts = {
  prefetch?: boolean;
  jsSandbox?: boolean;
};

export type Rebuilder = () => void;
export type Freer = () => Rebuilder;
