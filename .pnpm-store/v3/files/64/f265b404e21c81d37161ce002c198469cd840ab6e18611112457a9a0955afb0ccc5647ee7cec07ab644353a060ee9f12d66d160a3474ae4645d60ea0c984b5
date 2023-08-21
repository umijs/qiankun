declare const DEPENDENCY_TYPES: readonly ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
export declare type VersionType = "major" | "minor" | "patch" | "none";
export declare type DependencyType = typeof DEPENDENCY_TYPES[number];
export declare type AccessType = "public" | "restricted";
export declare type Release = {
    name: string;
    type: VersionType;
};
export declare type ComprehensiveRelease = {
    name: string;
    type: VersionType;
    oldVersion: string;
    newVersion: string;
    changesets: string[];
};
export declare type Changeset = {
    summary: string;
    releases: Array<Release>;
};
export declare type NewChangeset = Changeset & {
    id: string;
};
export declare type ReleasePlan = {
    changesets: NewChangeset[];
    releases: ComprehensiveRelease[];
    preState: PreState | undefined;
};
export declare type PackageJSON = {
    name: string;
    version: string;
    dependencies?: {
        [key: string]: string;
    };
    peerDependencies?: {
        [key: string]: string;
    };
    devDependencies?: {
        [key: string]: string;
    };
    optionalDependencies?: {
        [key: string]: string;
    };
    resolutions?: {
        [key: string]: string;
    };
    private?: boolean;
    publishConfig?: {
        access?: AccessType;
        directory?: string;
        registry?: string;
    };
};
export declare type PackageGroup = ReadonlyArray<string>;
export declare type Fixed = ReadonlyArray<PackageGroup>;
export declare type Linked = ReadonlyArray<PackageGroup>;
export interface PrivatePackages {
    version: boolean;
    tag: boolean;
}
export declare type Config = {
    changelog: false | readonly [string, any];
    commit: false | readonly [string, any];
    fixed: Fixed;
    linked: Linked;
    access: AccessType;
    baseBranch: string;
    changedFilePatterns: readonly string[];
    /** Features enabled for Private packages */
    privatePackages: PrivatePackages;
    /** The minimum bump type to trigger automatic update of internal dependencies that are part of the same release */
    updateInternalDependencies: "patch" | "minor";
    ignore: ReadonlyArray<string>;
    /** This is supposed to be used with pnpm's `link-workspace-packages: false` and Berry's `enableTransparentWorkspaces: false` */
    bumpVersionsWithWorkspaceProtocolOnly?: boolean;
    ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: Omit<Required<ExperimentalOptions>, "useCalculatedVersionForSnapshots">;
    snapshot: {
        useCalculatedVersion: boolean;
        prereleaseTemplate: string | null;
    };
};
export declare type WrittenConfig = {
    changelog?: false | readonly [string, any] | string;
    commit?: boolean | readonly [string, any] | string;
    fixed?: Fixed;
    linked?: Linked;
    access?: AccessType;
    baseBranch?: string;
    changedFilePatterns?: readonly string[];
    /** Opt in to tracking non-npm / private packages */
    privatePackages?: false | {
        version?: boolean;
        tag?: boolean;
    };
    /** The minimum bump type to trigger automatic update of internal dependencies that are part of the same release */
    updateInternalDependencies?: "patch" | "minor";
    ignore?: ReadonlyArray<string>;
    bumpVersionsWithWorkspaceProtocolOnly?: boolean;
    snapshot?: {
        useCalculatedVersion?: boolean;
        prereleaseTemplate?: string;
    };
    ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH?: ExperimentalOptions;
};
export declare type ExperimentalOptions = {
    onlyUpdatePeerDependentsWhenOutOfRange?: boolean;
    updateInternalDependents?: "always" | "out-of-range";
    /** @deprecated Since snapshot feature is now stable, you should migrate to use "snapshot.useCalculatedVersion". */
    useCalculatedVersionForSnapshots?: boolean;
};
export declare type NewChangesetWithCommit = NewChangeset & {
    commit?: string;
};
export declare type ModCompWithPackage = ComprehensiveRelease & {
    packageJson: PackageJSON;
    dir: string;
};
export declare type GetReleaseLine = (changeset: NewChangesetWithCommit, type: VersionType, changelogOpts: null | Record<string, any>) => Promise<string>;
export declare type GetDependencyReleaseLine = (changesets: NewChangesetWithCommit[], dependenciesUpdated: ModCompWithPackage[], changelogOpts: any) => Promise<string>;
export declare type ChangelogFunctions = {
    getReleaseLine: GetReleaseLine;
    getDependencyReleaseLine: GetDependencyReleaseLine;
};
export declare type GetAddMessage = (changeset: Changeset, commitOptions: any) => Promise<string>;
export declare type GetVersionMessage = (releasePlan: ReleasePlan, commitOptions: any) => Promise<string>;
export declare type CommitFunctions = {
    getAddMessage?: GetAddMessage;
    getVersionMessage?: GetVersionMessage;
};
export declare type PreState = {
    mode: "pre" | "exit";
    tag: string;
    initialVersions: {
        [pkgName: string]: string;
    };
    changesets: string[];
};
export {};
