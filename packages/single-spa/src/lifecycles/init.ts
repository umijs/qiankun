import {
  AppOrParcelStatus,
  toName,
  isParcel,
} from "../applications/app.helpers";
import { reasonableTime } from "../applications/timeouts";
import { handleAppError, transformErr } from "../applications/app-errors";
import { ProfileEntry, addProfileEntry } from "../devtools/profiler";
import { LoadedAppOrParcel } from "./lifecycle.helpers";

export function toInitPromise(
  appOrParcel: LoadedAppOrParcel,
  hardFail?: boolean,
): Promise<LoadedAppOrParcel> {
  let startTime: number, profileEventType: ProfileEntry["type"];

  return Promise.resolve().then(() => {
    if (appOrParcel.status !== AppOrParcelStatus.NOT_INITIALIZED) {
      return appOrParcel;
    }

    if (__PROFILE__) {
      profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
      startTime = performance.now();
    }

    appOrParcel.status = AppOrParcelStatus.INITIALIZING;

    return reasonableTime(appOrParcel, "init")
      .then(successfulInit)
      .catch((err) => {
        if (__PROFILE__) {
          addProfileEntry(
            profileEventType,
            toName(appOrParcel),
            "init",
            startTime,
            performance.now(),
            false,
          );
        }

        if (hardFail) {
          throw transformErr(
            err,
            appOrParcel,
            AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
          );
        } else {
          handleAppError(
            err,
            appOrParcel,
            AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
          );
          return appOrParcel;
        }
      });
  });

  function successfulInit(): LoadedAppOrParcel {
    appOrParcel.status = AppOrParcelStatus.NOT_MOUNTED;

    if (__PROFILE__) {
      addProfileEntry(
        profileEventType,
        toName(appOrParcel),
        "init",
        startTime,
        performance.now(),
        true,
      );
    }

    return appOrParcel;
  }
}
