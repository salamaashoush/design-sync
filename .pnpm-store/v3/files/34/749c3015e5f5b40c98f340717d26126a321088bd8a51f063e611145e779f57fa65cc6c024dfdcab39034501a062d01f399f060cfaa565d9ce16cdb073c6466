import { Accessor } from 'solid-js';

/**
 * attaches a MediaQuery listener to window, listeneing to changes to provided query
 * @param query Media query to listen for
 * @param callback function called every time the media match changes
 * @returns function removing the listener
 * @example
 * const clear = makeMediaQueryListener("(max-width: 767px)", e => {
 *    console.log(e.matches)
 * });
 * // remove listeners (will happen also on cleanup)
 * clear()
 */
declare function makeMediaQueryListener(query: string | MediaQueryList, callback: (e: MediaQueryListEvent) => void): VoidFunction;
/**
 * Creates a very simple and straightforward media query monitor.
 *
 * @param query Media query to listen for
 * @param fallbackState Server fallback state *(Defaults to `false`)*
 * @returns Boolean value if media query is met or not
 *
 * @example
 * ```ts
 * const isSmall = createMediaQuery("(max-width: 767px)");
 * console.log(isSmall());
 * ```
 */
declare function createMediaQuery(query: string, serverFallback?: boolean): () => boolean;
/**
 * Provides a signal indicating if the user has requested dark color theme. The setting is being watched with a [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).
 *
 * @param serverFallback value that should be returned on the server — defaults to `false`
 *
 * @returns a boolean signal
 * @example
 * const prefersDark = usePrefersDark();
 * createEffect(() => {
 *    prefersDark() // => boolean
 * });
 */
declare function createPrefersDark(serverFallback?: boolean): () => boolean;
/**
 * Provides a signal indicating if the user has requested dark color theme. The setting is being watched with a [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).
 *
 * This is a [singleton root primitive](https://github.com/solidjs-community/solid-primitives/tree/main/packages/rootless#createSingletonRoot) except if during hydration.
 *
 * @returns a boolean signal
 * @example
 * const prefersDark = usePrefersDark();
 * createEffect(() => {
 *    prefersDark() // => boolean
 * });
 */
declare const usePrefersDark: () => Accessor<boolean>;
type Breakpoints = Record<string, string>;
type Matches<T extends Breakpoints> = {
    readonly [K in keyof T]: K extends "key" ? never : boolean;
} & {
    key: keyof T;
};
interface BreakpointOptions<T extends Breakpoints> {
    /** If true watches changes and reports state reactively */
    watchChange?: boolean;
    /** Default value of `match` when `window.matchMedia` is not available like during SSR & legacy browsers */
    fallbackState?: Matches<T>;
    /** Use `min-width` media query for mobile first or `max-width` for desktop first. Defaults to `min-width`  */
    mediaFeature?: string;
}
/**
 * Creates a multi-breakpoint monitor to make responsive components easily.
 *
 * @param breakpoints Map of breakpoint names and their widths
 * @param options Options to customize watch, fallback, responsive mode.
 * @returns map of currently matching breakpoints.
 *
 * @example
 * ```ts
 * const breakpoints = {
    sm: "640px",
    lg: "1024px",
    xl: "1280px",
  };
 * const matches = createBreakpoints(breakpoints);
 * console.log(matches.lg);
 * ```
 */
declare function createBreakpoints<T extends Breakpoints>(breakpoints: T, options?: BreakpointOptions<T>): Matches<T>;
/**
 * Creates a sorted copy of the Breakpoints Object
 * If you want to use the result of `createBreakpoints()` with string coercion:
 * ```ts
 * createBreakpoints(sortBreakpoints({ tablet: "980px", mobile: "640px" }))
 * ```
 */
declare function sortBreakpoints(breakpoints: Breakpoints): Breakpoints;

export { BreakpointOptions, Breakpoints, Matches, createBreakpoints, createMediaQuery, createPrefersDark, makeMediaQueryListener, sortBreakpoints, usePrefersDark };
