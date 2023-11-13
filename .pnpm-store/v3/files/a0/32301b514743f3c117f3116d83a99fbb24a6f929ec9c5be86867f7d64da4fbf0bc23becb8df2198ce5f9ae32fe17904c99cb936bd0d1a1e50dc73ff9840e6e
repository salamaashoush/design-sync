import { Accessor, JSX, AccessorArray } from 'solid-js';

/**
 * Reactively maps an array by specified key with a callback function - underlying helper for the `<Key>` control flow.
 * @param list input list of values to map
 * @param keyFn key getter, items will be identified by it's value. changing the value is changing the item.
 * @param mapFn reactive function used to create mapped output item. Similar to `Array.prototype.map` but both item and index are signals, that could change over time.
 * @param options a fallback for when the input list is empty or missing
 * @returns mapped input array signal
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/keyed#keyArray
 */
declare function keyArray<T, U, K>(items: Accessor<readonly T[] | undefined | null | false>, keyFn: (item: T, index: number) => K, mapFn: (v: Accessor<T>, i: Accessor<number>) => U, options?: {
    fallback?: Accessor<U>;
}): Accessor<U[]>;
/**
 * creates a list of elements from the input `each` list
 *
 * it receives a map function as its child that receives a **list item signal** and **index signal** and returns a JSX-Element; if the list is empty, an optional fallback is returned:
 * ```tsx
 * <Key each={items()} by={item => item.id} fallback={<div>No items</div>}>
 *   {(item, index) => <div data-index={index()}>{item()}</div>}
 * </Key>
 * ```
 *
 * prop `by` can also be an object key:
 * ```tsx
 * <Key each={items()} by="id">
 * ```
 *
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/keyed#Key
 */
declare function Key<T>(props: {
    each?: readonly T[] | null | false;
    by: ((v: T) => any) | keyof T;
    fallback?: JSX.Element;
    children: (v: Accessor<T>, i: Accessor<number>) => JSX.Element;
}): JSX.Element;
/**
 * creates a list of elements from the entries of provided object
 *
 * @param props
 * @param props.of object to iterate entries of (`Object.entries(object)`)
 * @param props.children
 * a map render function that receives an object key, **value signal** and **index signal** and returns a JSX-Element; if the list is empty, an optional fallback is returned:
 * ```tsx
 * <Entries of={object()} fallback={<div>No items</div>}>
 *   {(key, value, index) => <div data-index={index()}>{key}: {value()}</div>}
 * </Entries>
 * ```
 *
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/keyed#Entries
 */
declare function Entries<V>(props: {
    of: Record<string, V> | ArrayLike<V> | undefined | null | false;
    fallback?: JSX.Element;
    children: (key: string, v: Accessor<V>, i: Accessor<number>) => JSX.Element;
}): JSX.Element;
type RerunChildren<T> = ((input: T, prevInput: T | undefined) => JSX.Element) | JSX.Element;
/**
 * Causes the children to rerender when the `on` changes.
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/refs#Rerun
 */
declare function Rerun<S>(props: {
    on: AccessorArray<S> | Accessor<S>;
    children: RerunChildren<S>;
}): JSX.Element;
declare function Rerun<S extends (object | string | bigint | number | boolean) & {
    length?: never;
}>(props: {
    on: S;
    children: RerunChildren<S>;
}): JSX.Element;

export { Entries, Key, Rerun, RerunChildren, keyArray };
