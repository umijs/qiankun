import {
  AppOrParcelStatus,
  toName,
  isParcel,
} from "../applications/app.helpers";
import { transformErr, formatErrorMessage } from "../applications/app-errors";
import { reasonableTime } from "../applications/timeouts";
import { ProfileEntry, addProfileEntry } from "../devtools/profiler";
import { LoadedAppOrParcel } from "./lifecycle.helpers";

export function toUpdatePromise(
  appOrParcel: LoadedAppOrParcel,
): Promise<LoadedAppOrParcel> {
  return Promise.resolve().then(() => {
    let startTime: number, profileEventType: ProfileEntry["type"];

    if (__PROFILE__) {
      profileEventType = isParcel(appOrParcel) ? "parcel" : "application";
      startTime = performance.now();
    }

    if (appOrParcel.status !== AppOrParcelStatus.MOUNTED) {
      throw Error(
        formatErrorMessage(
          32,
          __DEV__ &&
            `Cannot update parcel '${toName(
              appOrParcel,
            )}' because it is not mounted`,
          toName(appOrParcel),
        ),
      );
    }

    appOrParcel.status = AppOrParcelStatus.UPDATING;

    return reasonableTime(appOrParcel, "update")
      .then(() => {
        appOrParcel.status = AppOrParcelStatus.MOUNTED;

        if (__PROFILE__) {
          addProfileEntry(
            profileEventType,
            toName(appOrParcel),
            "update",
            startTime,
            performance.now(),
            true,
          );
        }

        return appOrParcel;
      })
      .catch((err) => {
        if (__PROFILE__) {
          addProfileEntry(
            profileEventType,
            toName(appOrParcel),
            "update",
            startTime,
            performance.now(),
            false,
          );
        }

        throw transformErr(
          err,
          appOrParcel,
          AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
        );
      });
  });
}
