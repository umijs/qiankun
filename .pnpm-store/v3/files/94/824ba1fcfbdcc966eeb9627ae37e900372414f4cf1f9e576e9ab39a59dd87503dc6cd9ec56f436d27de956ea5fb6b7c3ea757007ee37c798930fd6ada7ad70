import type { IDepAnalyzeResult } from '../transformer/demo/dependencies';
export { default as context } from './context';
export { default as Link } from './components/Link';
export { default as NavLink } from './components/NavLink';
export { default as AnchorLink } from './components/AnchorLink';
export { default as useSearch } from './hooks/useSearch';
export { default as useCopy } from './hooks/useCopy';
export { default as useRiddle } from './hooks/useRiddle';
export { default as useMotions } from './hooks/useMotions';
export { default as useCodeSandbox } from './hooks/useCodeSandbox';
export { default as useLocaleProps } from './hooks/useLocaleProps';
export { default as useDemoUrl, getDemoUrl } from './hooks/useDemoUrl';
export { default as useApiData } from './hooks/useApiData';
export { default as useTSPlaygroundUrl } from './hooks/useTSPlaygroundUrl';
export { default as usePrefersColor } from './hooks/usePrefersColor';
export interface IPreviewerComponentProps {
    title?: string;
    description?: string;
    sources: {
        /**
         * self source code for demo
         * @note  jsx exsits definitely, tsx exists when the source code language is tsx
         */
        _: {
            jsx: string;
            tsx?: string;
        };
    } | Record<string, {
        import: string;
        content: string;
        path?: string;
        tsx?: string;
    }>;
    /**
     * third-party dependencies of demo
     */
    dependencies: IDepAnalyzeResult['dependencies'];
    /**
     * global identifier for demo
     */
    identifier: string;
    /**
     * the component which demo belongs to
     */
    componentName?: string;
    /**
     * motions of current demo, for snapshot or preview
     */
    motions?: string[];
    /**
     * mark demo as debug demo, will be discarded in production mode
     */
    debug?: true;
    [key: string]: any;
}
export interface IApiComponentProps {
    /**
     * api data identifier
     * @note  it is the component identifier by default
     *        will fallback to the src path on <code> element if component identifier is not available
     */
    identifier: string;
    /**
     * which export should be displayed
     */
    export: string;
    /**
     * whether the title is hidden when compiling
     */
    hideTitle: boolean;
}
