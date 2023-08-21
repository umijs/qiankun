import React from 'react';
import type { IConfig, IRoute } from '@umijs/types';
import type { INav } from '../routes/getNavFromRoutes';
import type { IMenu } from '../routes/getMenuFromRoutes';
import type { ILocale } from '../routes/getLocaleFromRoutes';
import type { IApiDefinition } from '../api-parser';
import type { IDumiOpts } from '..';
import type { IPreviewerComponentProps } from '.';
export interface IThemeContext {
    /**
     * documentation config
     */
    config: {
        /**
         * mode type
         */
        mode: 'doc' | 'site';
        /**
         * site title
         */
        title: IDumiOpts['title'];
        /**
         * site description
         */
        description?: IDumiOpts['description'];
        /**
         * documentation repository URL
         */
        repository: {
            url?: string;
            branch: string;
            platform?: string;
        };
        /**
         * logo image URL
         */
        logo?: IDumiOpts['logo'];
        /**
         * navigation configurations
         */
        navs: INav;
        /**
         * sidemenu configurations
         */
        menus: IMenu;
        /**
         * locale configurations
         */
        locales: ILocale[];
        /**
         * algolia configurations
         */
        algolia?: IDumiOpts['algolia'];
        /**
         * theme config
         */
        theme: IDumiOpts['theme'];
        /**
         * configure how html is output
         */
        exportStatic?: IConfig['exportStatic'];
    };
    /**
     * the meta information of current route
     */
    meta: {
        /**
         * page title
         */
        title: string;
        /**
         * control sidemenu display
         */
        sidemenu?: boolean;
        /**
         * control toc position in page
         */
        toc?: false | 'content' | 'menu';
        [key: string]: any;
    };
    /**
     * current locale
     */
    locale?: string;
    /**
     * current menu
     */
    menu: IMenu['locale']['path'];
    /**
     * current nav
     */
    nav: INav['locale'];
    /**
     * base path
     */
    base: string;
    /**
     * documentation routes
     */
    routes: (IRoute & {
        meta: any;
    })[];
    /**
     * all demos data
     */
    demos: Record<string, {
        component: React.ComponentType;
        previewerProps: IPreviewerComponentProps;
    }>;
    /**
     * all parsed api data
     */
    apis: Record<string, IApiDefinition>;
}
declare const _default: React.Context<IThemeContext>;
export default _default;
