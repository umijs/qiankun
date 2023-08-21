import type { IRoute } from '@umijs/types';
import type { IDumiOpts } from '..';
export interface INavItem {
    title: string;
    path?: string;
    [key: string]: any;
    children: INavItem[];
}
export type INav = Record<string, INavItem[]>;
declare const _default: (routes: IRoute[], opts: IDumiOpts, userCustomNavs: INav | INavItem[]) => INav;
export default _default;
