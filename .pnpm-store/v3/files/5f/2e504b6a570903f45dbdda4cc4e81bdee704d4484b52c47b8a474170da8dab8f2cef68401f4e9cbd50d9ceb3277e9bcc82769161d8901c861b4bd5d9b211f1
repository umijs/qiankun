import { AccessType, PackageJSON } from "@changesets/types";
import { TwoFactorState } from "../../utils/types";
interface PublishOptions {
    cwd: string;
    publishDir: string;
    access: AccessType;
    tag: string;
}
export declare function getTokenIsRequired(): Promise<boolean>;
export declare function getPackageInfo(packageJson: PackageJSON): Promise<any>;
export declare function infoAllow404(packageJson: PackageJSON): Promise<{
    published: boolean;
    pkgInfo: any;
}>;
export declare let getOtpCode: (twoFactorState: TwoFactorState) => Promise<string>;
export declare function publish(pkgName: string, opts: PublishOptions, twoFactorState: TwoFactorState): Promise<{
    published: boolean;
}>;
export {};
