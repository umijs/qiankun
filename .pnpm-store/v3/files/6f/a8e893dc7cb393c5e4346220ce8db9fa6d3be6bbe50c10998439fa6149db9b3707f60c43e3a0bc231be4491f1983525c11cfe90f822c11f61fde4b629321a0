export interface ICreateInfo {
    createTime?: string;
    creator?: string;
    creatorEmail?: string;
    createSince?: string;
}
export interface IModifyInfo {
    modifyTime?: string;
    modifier?: string;
    modifierEmail?: string;
    modifySince?: string;
}
/**
 * 获取文件创建信息
 * @param filePath 文件路径，绝对或相对 .git
 * @param gitDirPath .git路径
 * @returns
 */
export declare const getFileCreateInfo: (filePath: string, gitDirPath?: string) => Promise<{
    createTime: string | undefined;
    creator: string | undefined;
    creatorEmail: string | undefined;
    createSince: string | undefined;
} | {
    createTime?: undefined;
    creator?: undefined;
    creatorEmail?: undefined;
    createSince?: undefined;
}>;
/**
 * 获取文件最新修改信息
 * @param filePath 文件路径，绝对或相对 .git
 * @param gitDirPath .git路径
 * @returns
 */
export declare const getFileLastModifyInfo: (filePath: string, gitDirPath?: string) => Promise<{
    modifyTime: string | undefined;
    modifier: string | undefined;
    modifierEmail: string | undefined;
    modifySince: string | undefined;
} | {
    modifyTime?: undefined;
    modifier?: undefined;
    modifierEmail?: undefined;
    modifySince?: undefined;
}>;
export declare const isGitRepo: () => Promise<boolean>;
