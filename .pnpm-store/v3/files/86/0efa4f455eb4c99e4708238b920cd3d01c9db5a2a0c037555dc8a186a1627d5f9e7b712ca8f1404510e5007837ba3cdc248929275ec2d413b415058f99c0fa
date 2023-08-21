import { History, Location } from 'history-with-query';
import { FunctionComponent } from 'react';
import { match } from 'react-router-dom';
export interface IComponent extends FunctionComponent {
    getInitialProps?: Function;
    preload?: () => Promise<any>;
}
export interface IRoute {
    path?: string;
    exact?: boolean;
    redirect?: string;
    component?: IComponent | string;
    routes?: IRoute[];
    key?: any;
    strict?: boolean;
    sensitive?: boolean;
    wrappers?: any[];
    [k: string]: any;
}
export interface IRouteComponentProps<Params extends {
    [K in keyof Params]?: string;
} = {}, Query extends {
    [K in keyof Query]?: string;
} = {}> {
    children: JSX.Element;
    location: Location & {
        query: Query;
    };
    route: IRoute;
    routes: IRoute[];
    history: History;
    match: match<Params>;
}
export { default as renderRoutes } from './renderRoutes/renderRoutes';
