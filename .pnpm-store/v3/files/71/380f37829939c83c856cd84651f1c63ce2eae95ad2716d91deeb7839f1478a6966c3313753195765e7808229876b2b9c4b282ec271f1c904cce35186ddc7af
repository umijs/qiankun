import yParser from '../../compiled/yargs-parser';
export interface IGeneratorOpts {
    baseDir: string;
    args: yParser.Arguments;
    slient?: boolean;
}
interface IGeneratorBaseOpts {
    context: Record<string, any>;
    target: string;
}
interface IGeneratorCopyTplOpts extends IGeneratorBaseOpts {
    templatePath: string;
}
interface IGeneratorCopyDirectoryOpts extends IGeneratorBaseOpts {
    path: string;
}
declare class Generator {
    baseDir: string;
    args: yParser.Arguments;
    slient: boolean;
    prompts: any;
    constructor({ baseDir, args, slient }: IGeneratorOpts);
    run(): Promise<void>;
    prompting(): any;
    writing(): Promise<void>;
    copyTpl(opts: IGeneratorCopyTplOpts): void;
    copyDirectory(opts: IGeneratorCopyDirectoryOpts): void;
}
export default Generator;
