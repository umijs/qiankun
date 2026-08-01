let profileEntries: ProfileEntry[] = [];

export interface ProfileEntry {
  type: "application" | "parcel" | "routing";
  name: string;
  kind:
    | "init"
    | "load"
    | "mount"
    | "unload"
    | "unmount"
    | "update"
    | "loadApps"
    | "silentNavigation"
    | "browserNavigation"
    | "triggerAppChange";
  operationSucceeded: boolean;
  start: number;
  end: number;
}

export function getProfilerData() {
  return profileEntries;
}

export function addProfileEntry(
  type: ProfileEntry["type"],
  name: ProfileEntry["name"],
  kind: ProfileEntry["kind"],
  start: ProfileEntry["start"],
  end: ProfileEntry["end"],
  operationSucceeded: ProfileEntry["operationSucceeded"],
): void {
  profileEntries.push({
    type,
    name,
    start,
    end,
    kind,
    operationSucceeded,
  });
}

export function clearProfilerData(): void {
  profileEntries = [];
}
