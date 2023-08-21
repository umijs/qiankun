export interface IUser {
    avatar_url: string;
    email: string;
    id: string;
    name: string;
    username: string;
    jwt: string;
}
export interface IConfig {
    [key: string]: any | undefined;
    lastUpdate?: number;
    user?: IUser;
}
/**
 * Load and parse config file
 */
export declare function read(): Promise<IConfig>;
export declare function remove(key: string): Promise<void>;
/**
 * Merge the given data in the current config
 * @param data
 */
export declare function merge(data: object): Promise<{
    [x: string]: any;
    lastUpdate?: number | undefined;
    user?: IUser | undefined;
}>;
/**
 * Delete given user from config
 *
 * @export
 */
export declare function deleteUser(): Promise<void>;
/**
 * Save specific user in state
 *
 * @export
 * @param {User} user
 * @returns
 */
export declare function saveUser(token: string, user: IUser): Promise<{
    [x: string]: any;
    lastUpdate?: number | undefined;
    user?: IUser | undefined;
}>;
/**
 * Gets user from config
 *
 * @export
 * @returns
 */
export declare function getUser(): Promise<IUser | undefined>;
export declare function getToken(): Promise<string | undefined>;
export declare const removeFile: () => Promise<void>;
