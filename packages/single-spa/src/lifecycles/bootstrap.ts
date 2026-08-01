import { AppOrParcelStatus, toName, isParcel } from '../applications/app.helpers';
import { reasonableTime } from '../applications/timeouts';
import { handleAppError, transformErr } from '../applications/app-errors';
import { ProfileEntry, addProfileEntry } from '../devtools/profiler';
import { LoadedAppOrParcel } from './lifecycle.helpers';

export function toBootstrapPromise(appOrParcel: LoadedAppOrParcel, hardFail?: boolean): Promise<LoadedAppOrParcel> {
  let startTime: number, profileEventType: ProfileEntry['type'];

  return Promise.resolve().then(() => {
    if (appOrParcel.status !== AppOrParcelStatus.NOT_BOOTSTRAPPED) {
      return appOrParcel;
    }

    if (__PROFILE__) {
      profileEventType = isParcel(appOrParcel) ? 'parcel' : 'application';
      startTime = performance.now();
    }

    appOrParcel.status = AppOrParcelStatus.BOOTSTRAPPING;

    return reasonableTime(appOrParcel, 'bootstrap')
      .then(successfulBootstrap)
      .catch((err) => {
        if (__PROFILE__) {
          addProfileEntry(profileEventType, toName(appOrParcel), 'bootstrap', startTime, performance.now(), false);
        }

        if (hardFail) {
          throw transformErr(err, appOrParcel, AppOrParcelStatus.SKIP_BECAUSE_BROKEN);
        } else {
          handleAppError(err, appOrParcel, AppOrParcelStatus.SKIP_BECAUSE_BROKEN);
          return appOrParcel;
        }
      });
  });

  function successfulBootstrap(): LoadedAppOrParcel {
    appOrParcel.status = AppOrParcelStatus.NOT_MOUNTED;

    if (__PROFILE__) {
      addProfileEntry(profileEventType, toName(appOrParcel), 'bootstrap', startTime, performance.now(), true);
    }

    return appOrParcel;
  }
}
