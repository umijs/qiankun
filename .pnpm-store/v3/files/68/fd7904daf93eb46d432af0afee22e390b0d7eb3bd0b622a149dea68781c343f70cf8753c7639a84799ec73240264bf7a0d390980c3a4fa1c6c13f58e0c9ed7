import { IConfig, IRoute } from '..';
interface IOpts {
    onPatchRoutesBefore?: Function;
    onPatchRoutes?: Function;
    onPatchRouteBefore?: Function;
    onPatchRoute?: Function;
}
interface IGetRoutesOpts {
    config: IConfig;
    root: string;
    componentPrefix?: string;
    isConventional?: boolean;
    parentRoute?: IRoute;
}
declare class Route {
    opts: IOpts;
    constructor(opts?: IOpts);
    getRoutes(opts: IGetRoutesOpts): Promise<any>;
    patchRoutes(routes: IRoute[], opts: IGetRoutesOpts): Promise<void>;
    patchRoute(route: IRoute, opts: IGetRoutesOpts): Promise<void>;
    getConventionRoutes(opts: any): IRoute[];
    getJSON(opts: {
        routes: IRoute[];
        config: IConfig;
        cwd: string;
        isServer?: boolean;
    }): string;
    getPaths({ routes }: {
        routes: IRoute[];
    }): string[];
}
export default Route;
