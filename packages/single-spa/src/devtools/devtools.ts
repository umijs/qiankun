import { getRawAppData, unregisterApplication } from '../applications/apps';
import { reroute } from '../navigation/reroute';
import { AppOrParcelStatus } from '../applications/app.helpers';
import { toLoadPromise } from '../lifecycles/load';
import { toBootstrapPromise } from '../lifecycles/bootstrap';
import { getProfilerData } from './profiler';

export default {
  getRawAppData,
  reroute,
  NOT_LOADED: AppOrParcelStatus.NOT_LOADED,
  toLoadPromise,
  toBootstrapPromise: toBootstrapPromise,
  unregisterApplication,
  getProfilerData,
};
