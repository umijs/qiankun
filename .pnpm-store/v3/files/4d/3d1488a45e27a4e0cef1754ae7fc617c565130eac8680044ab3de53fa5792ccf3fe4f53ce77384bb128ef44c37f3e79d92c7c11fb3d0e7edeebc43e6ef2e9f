import { Config } from "@changesets/types";
import { Package } from "@manypkg/get-packages";
import { InternalRelease, PreInfo } from "./types";
export default function determineDependents({ releases, packagesByName, dependencyGraph, preInfo, config, }: {
    releases: Map<string, InternalRelease>;
    packagesByName: Map<string, Package>;
    dependencyGraph: Map<string, string[]>;
    preInfo: PreInfo | undefined;
    config: Config;
}): boolean;
