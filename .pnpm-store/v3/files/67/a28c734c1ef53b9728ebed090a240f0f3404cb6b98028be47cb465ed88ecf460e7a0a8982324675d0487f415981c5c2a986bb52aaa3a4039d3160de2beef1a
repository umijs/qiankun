export interface IDemoOpts {
    isTSX: boolean;
    fileAbsPath: string;
    transformRuntime?: any;
}
export declare const getBabelOptions: ({ isTSX, fileAbsPath, transformRuntime }: IDemoOpts) => {
    filename: string;
    presets: (string | Function | [string, any, string?] | (string | {
        transformRuntime?: any;
        reactRequire: boolean;
        typescript: boolean;
    })[])[];
    plugins: (string | Function | [string, any, string?] | (string | {
        strict: boolean;
    })[])[];
    ast: boolean;
    babelrc: boolean;
    configFile: boolean;
};
