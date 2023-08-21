export declare type NpmClient = 'npm' | 'cnpm' | 'tnpm' | 'yarn' | 'pnpm';
export declare const npmClients: string[];
export declare enum NpmClientEnum {
    pnpm = "pnpm",
    tnpm = "tnpm",
    cnpm = "cnpm",
    yarn = "yarn",
    npm = "npm"
}
export declare const getNpmClient: (opts: {
    cwd: string;
}) => NpmClient;
export declare const installWithNpmClient: ({ npmClient, cwd, }: {
    npmClient: NpmClient;
    cwd?: string | undefined;
}) => void;
