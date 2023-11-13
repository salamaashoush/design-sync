import { JSX, MergeProps } from 'solid-js';
import { MaybeAccessor } from '@solid-primitives/utils';

declare const propTraps: ProxyHandler<{
    get: (k: string | number | symbol) => any;
    has: (k: string | number | symbol) => boolean;
    keys: () => string[];
}>;

/**
 * An alternative primitive to Solid's [splitProps](https://www.solidjs.com/docs/latest/api#splitprops) allowing you to create a new props object with only the property names that match the predicate.
 *
 * The predicate is run for every property read lazily, instead of calculated eagerly like the original splitProps. Any signal accessed within the `predicate` will be tracked, and `predicate` re-executed if changed.
 *
 * @param props The props object to filter.
 * @param predicate A function that returns `true` if the property should be included in the filtered object.
 * @returns A new props object with only the properties that match the predicate.
 *
 * @example
 * ```tsx
 * const dataProps = filterProps(props, key => key.startsWith("data-"));
 * <div {...dataProps} />
 * ```
 */
declare function filterProps<T extends object>(props: T, predicate: (key: keyof T) => boolean): T;
/**
 * Creates a predicate function that can be used to filter props by the prop name dynamically.
 *
 * The provided {@link predicate} function get's wrapped with a cache layer to prevent unnecessary re-evaluation. If one property is requested multiple times, the predicate function will only be evaluated once.
 *
 * The cache is only cleared when the keys of the props object change. *(when spreading props from a singal)*
 *
 * @param props The props object to filter.
 * @param predicate A function that returns `true` if the property should be included in the filtered object.
 * @returns A cached predicate function that filters the props object.
 *
 * @example
 * ```tsx
 * const predicate = createPropsPredicate(props, key => key.startsWith("data-"));
 * const dataProps = filterProps(props, predicate);
 * <div {...dataProps} />
 * ```
 */
declare function createPropsPredicate<T extends object>(props: T, predicate: (key: keyof T) => boolean): (key: keyof T) => boolean;

/**
 * converts inline string styles to object form
 * @example
 * const styles = stringStyleToObject("margin: 24px; border: 1px solid #121212");
 * styles; // { margin: "24px", border: "1px solid #121212" }
 * */
declare function stringStyleToObject(style: string): JSX.CSSProperties;
/**
 * Combines two set of styles together. Accepts both string and object styles.\
 * @example
 * const styles = combineStyle("margin: 24px; border: 1px solid #121212", {
 *   margin: "2rem",
 *   padding: "16px"
 * });
 * styles; // { margin: "2rem", border: "1px solid #121212", padding: "16px" }
 */
declare function combineStyle(a: string, b: string): string;
declare function combineStyle(a: JSX.CSSProperties | undefined, b: JSX.CSSProperties | undefined): JSX.CSSProperties;
declare function combineStyle(a: JSX.CSSProperties | string | undefined, b: JSX.CSSProperties | string | undefined): JSX.CSSProperties;
type PropsInput = {
    class?: string;
    className?: string;
    classList?: Record<string, boolean | undefined>;
    style?: JSX.CSSProperties | string;
    ref?: Element | ((el: any) => void);
} & Record<string, any>;
type CombinePropsOptions = {
    /**
     * by default the event handlers will be called left-to-right,
     * following the order of the sources.
     * If this option is set to true, the handlers will be called right-to-left.
     */
    reverseEventHandlers?: boolean;
};
/**
 * A helper that reactively merges multiple props objects together while smartly combining some of Solid's JSX/DOM attributes.
 *
 * Event handlers and refs are chained, class, classNames and styles are combined.
 * For all other props, the last prop object overrides all previous ones. Similarly to {@link mergeProps}
 * @param sources - Multiple sets of props to combine together.
 * @example
 * ```tsx
 * const MyButton: Component<ButtonProps> = props => {
 *    const { buttonProps } = createButton();
 *    const combined = combineProps(props, buttonProps);
 *    return <button {...combined} />
 * }
 * // component consumer can provide button props
 * // they will be combined with those provided by createButton() primitive
 * <MyButton style={{ margin: "24px" }} />
 * ```
 */
declare function combineProps<T extends [] | MaybeAccessor<PropsInput>[]>(sources: T, options?: CombinePropsOptions): MergeProps<T>;
declare function combineProps<T extends [] | MaybeAccessor<PropsInput>[]>(...sources: T): MergeProps<T>;

export { CombinePropsOptions, combineProps, combineStyle, createPropsPredicate, filterProps, propTraps, stringStyleToObject };
