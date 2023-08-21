import { IConfig } from '..';
import { IGetContentArgs, IOpts, IScript } from './types';
declare class Html {
    config: IConfig;
    tplPath?: string;
    constructor(opts: IOpts);
    getHtmlPath(path: string): string;
    getRelPathToPublicPath(path: string): string;
    getAsset(opts: {
        file: string;
        path?: string;
    }): string;
    getScriptsContent(scripts: IScript[]): string;
    getContent(args: IGetContentArgs): Promise<string>;
}
export default Html;
