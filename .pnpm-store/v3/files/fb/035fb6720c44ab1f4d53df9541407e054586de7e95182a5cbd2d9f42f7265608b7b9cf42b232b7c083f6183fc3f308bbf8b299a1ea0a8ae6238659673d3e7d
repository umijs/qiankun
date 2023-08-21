import type { IRoute, IApi } from '@umijs/types';
import type { IDumiOpts } from '..';
export interface IMenuItem {
    path?: string;
    title: string;
    meta?: Record<string, any>;
    children?: IMenuItem[];
}
export type IMenu = Record<string, {
    '*'?: IMenuItem[];
    [key: string]: IMenuItem[];
}>;
export declare function addHtmlSuffix(oPath: string): string;
export declare function menuSorter(prev: any, next: any): number;
export default function getMenuFromRoutes(routes: IRoute[], opts: IDumiOpts, paths: IApi['paths']): IMenu;
