import { reroute } from "./navigation/reroute";
import { patchHistoryApi } from "./navigation/navigation-events";
import { isInBrowser } from "./utils/runtime-environment";

let started: boolean = false;

export function start(opts?: StartOpts) {
  started = true;
  if (isInBrowser) {
    patchHistoryApi(opts);
    reroute();
  }
}

export function isStarted(): boolean {
  return started;
}

export interface StartOpts {
  urlRerouteOnly?: boolean;
}
