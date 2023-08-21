import { ComprehensiveRelease, PackageJSON, VersionType } from "@changesets/types";
export default function versionPackage(release: ComprehensiveRelease & {
    changelog: string | null;
    packageJson: PackageJSON;
    dir: string;
}, versionsToUpdate: Array<{
    name: string;
    version: string;
    type: VersionType;
}>, { updateInternalDependencies, onlyUpdatePeerDependentsWhenOutOfRange, bumpVersionsWithWorkspaceProtocolOnly, snapshot, }: {
    updateInternalDependencies: "patch" | "minor";
    onlyUpdatePeerDependentsWhenOutOfRange: boolean;
    bumpVersionsWithWorkspaceProtocolOnly?: boolean;
    snapshot?: string | boolean | undefined;
}): {
    packageJson: PackageJSON;
    name: string;
    type: VersionType;
    oldVersion: string;
    newVersion: string;
    changesets: string[];
    changelog: string | null;
    dir: string;
};
