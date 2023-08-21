import { ReleasePlan, Config, NewChangeset, PreState } from "@changesets/types";
import { Packages } from "@manypkg/get-packages";
declare type SnapshotReleaseParameters = {
    tag?: string | undefined;
    commit?: string | undefined;
};
declare type OptionalProp<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare function assembleReleasePlan(changesets: NewChangeset[], packages: Packages, config: OptionalProp<Config, "snapshot">, preState: PreState | undefined, snapshot?: SnapshotReleaseParameters | string | boolean): ReleasePlan;
export default assembleReleasePlan;
