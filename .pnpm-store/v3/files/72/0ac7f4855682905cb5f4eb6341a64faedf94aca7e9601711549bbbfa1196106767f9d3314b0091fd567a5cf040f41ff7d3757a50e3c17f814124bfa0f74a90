import { yargs } from '../index';
interface IOpts {
    cwd: string;
    args: yargs.Arguments;
}
declare class Generator {
    cwd: string;
    args: yargs.Arguments;
    prompts: any;
    constructor({ cwd, args }: IOpts);
    run(): Promise<void>;
    prompting(): any;
    writing(): Promise<void>;
    copyTpl(opts: {
        templatePath: string;
        target: string;
        context: object;
    }): void;
    copyDirectory(opts: {
        path: string;
        context: object;
        target: string;
    }): void;
}
export default Generator;
