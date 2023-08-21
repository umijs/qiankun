interface ThemeComponent {
    /**
     * component name
     */
    identifier: string;
    /**
     * component path
     */
    source: string;
    /**
     * resolved module path
     */
    modulePath: string;
}
export interface IThemeLoadResult {
    /**
     * theme name
     */
    name: string;
    /**
     * theme module path
     */
    modulePath: string;
    /**
     * layout paths
     */
    layoutPaths: {
        /**
         * outer layout path
         */
        _: string;
        /**
         * single demo route layout path
         */
        demo: string | null;
    };
    /**
     * builtin components
     */
    builtins: ThemeComponent[];
    /**
     * fallback components
     */
    fallbacks: ThemeComponent[];
    /**
     * customize markdown components
     */
    customs: ThemeComponent[];
}
export declare const REQUIRED_THEME_BUILTINS: string[];
declare const _default: () => Promise<IThemeLoadResult>;
export default _default;
