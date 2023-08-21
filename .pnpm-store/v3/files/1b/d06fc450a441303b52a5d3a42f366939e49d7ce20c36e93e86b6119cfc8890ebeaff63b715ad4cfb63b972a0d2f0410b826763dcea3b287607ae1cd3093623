import type { ActionFunction, ActionFunctionArgs, Blocker, BlockerFunction, Fetcher, HydrationState, JsonFunction, LoaderFunction, LoaderFunctionArgs, Location, Navigation, Params, ParamParseKey, Path, PathMatch, PathPattern, RedirectFunction, RelativeRoutingType, Router as RemixRouter, ShouldRevalidateFunction, To, InitialEntry, LazyRouteFunction, FutureConfig as RouterFutureConfig } from "@remix-run/router";
import { AbortedDeferredError, Action as NavigationType, createPath, defer, generatePath, isRouteErrorResponse, json, matchPath, matchRoutes, parsePath, redirect, redirectDocument, resolvePath } from "@remix-run/router";
import type { AwaitProps, MemoryRouterProps, NavigateProps, OutletProps, RouteProps, PathRouteProps, LayoutRouteProps, IndexRouteProps, RouterProps, RoutesProps, RouterProviderProps, FutureConfig } from "./lib/components";
import { createRoutesFromChildren, renderMatches, Await, MemoryRouter, Navigate, Outlet, Route, Router, RouterProvider, Routes } from "./lib/components";
import type { DataRouteMatch, DataRouteObject, IndexRouteObject, Navigator, NavigateOptions, NonIndexRouteObject, RouteMatch, RouteObject } from "./lib/context";
import { DataRouterContext, DataRouterStateContext, LocationContext, NavigationContext, RouteContext } from "./lib/context";
import type { NavigateFunction } from "./lib/hooks";
import { useBlocker, useHref, useInRouterContext, useLocation, useMatch, useNavigationType, useNavigate, useOutlet, useOutletContext, useParams, useResolvedPath, useRoutes, useActionData, useAsyncError, useAsyncValue, useRouteId, useLoaderData, useMatches, useNavigation, useRevalidator, useRouteError, useRouteLoaderData, useRoutesImpl } from "./lib/hooks";
type Hash = string;
type Pathname = string;
type Search = string;
export type { ActionFunction, ActionFunctionArgs, AwaitProps, Blocker as unstable_Blocker, BlockerFunction as unstable_BlockerFunction, DataRouteMatch, DataRouteObject, Fetcher, FutureConfig, Hash, IndexRouteObject, IndexRouteProps, JsonFunction, LazyRouteFunction, LayoutRouteProps, LoaderFunction, LoaderFunctionArgs, Location, MemoryRouterProps, NavigateFunction, NavigateOptions, NavigateProps, Navigation, Navigator, NonIndexRouteObject, OutletProps, Params, ParamParseKey, Path, PathMatch, Pathname, PathPattern, PathRouteProps, RedirectFunction, RelativeRoutingType, RouteMatch, RouteObject, RouteProps, RouterProps, RouterProviderProps, RoutesProps, Search, ShouldRevalidateFunction, To, };
export { AbortedDeferredError, Await, MemoryRouter, Navigate, NavigationType, Outlet, Route, Router, RouterProvider, Routes, createPath, createRoutesFromChildren, createRoutesFromChildren as createRoutesFromElements, defer, isRouteErrorResponse, generatePath, json, matchPath, matchRoutes, parsePath, redirect, redirectDocument, renderMatches, resolvePath, useActionData, useAsyncError, useAsyncValue, useBlocker as unstable_useBlocker, useHref, useInRouterContext, useLoaderData, useLocation, useMatch, useMatches, useNavigate, useNavigation, useNavigationType, useOutlet, useOutletContext, useParams, useResolvedPath, useRevalidator, useRouteError, useRouteLoaderData, useRoutes, };
declare function mapRouteProperties(route: RouteObject): Partial<RouteObject> & {
    hasErrorBoundary: boolean;
};
export declare function createMemoryRouter(routes: RouteObject[], opts?: {
    basename?: string;
    future?: Partial<Omit<RouterFutureConfig, "v7_prependBasename">>;
    hydrationData?: HydrationState;
    initialEntries?: InitialEntry[];
    initialIndex?: number;
}): RemixRouter;
/** @internal */
export { NavigationContext as UNSAFE_NavigationContext, LocationContext as UNSAFE_LocationContext, RouteContext as UNSAFE_RouteContext, DataRouterContext as UNSAFE_DataRouterContext, DataRouterStateContext as UNSAFE_DataRouterStateContext, mapRouteProperties as UNSAFE_mapRouteProperties, useRouteId as UNSAFE_useRouteId, useRoutesImpl as UNSAFE_useRoutesImpl, };
