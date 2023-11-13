import { Accessor } from 'solid-js';

/**
 * A reactive version of `Map` data structure. All the reads (like `get` or `has`) are signals, and all the writes (`delete` or `set`) will cause updates to appropriate signals.
 * @param initial initial entries of the reactive map
 * @param equals signal equals function, determining if a change should cause an update
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/map#ReactiveMap
 * @example
 * const userPoints = new ReactiveMap<User, number>();
 * createEffect(() => {
 *    userPoints.get(user1) // => T: number | undefined (reactive)
 *    userPoints.has(user1) // => T: boolean (reactive)
 *    userPoints.size // => T: number (reactive)
 * });
 * // apply changes
 * userPoints.set(user1, 100);
 * userPoints.delete(user2);
 * userPoints.set(user1, { foo: "bar" });
 */
declare class ReactiveMap<K, V> extends Map<K, V> {
    #private;
    constructor(initial?: Iterable<readonly [K, V]> | null);
    has(key: K): boolean;
    get(key: K): V | undefined;
    get size(): number;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    clear(): void;
    forEach(callbackfn: (value: V, key: K, map: this) => void): void;
    [Symbol.iterator](): IterableIterator<[K, V]>;
}
/**
 * A reactive version of `WeakMap` data structure. All the reads (like `get` or `has`) are signals, and all the writes (`delete` or `set`) will cause updates to appropriate signals.
 * @param initial initial entries of the reactive map
 * @param equals signal equals function, determining if a change should cause an update
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/map#ReactiveWeakMap
 * @example
 * const userPoints = new ReactiveWeakMap<User, number>();
 * createEffect(() => {
 *    userPoints.get(user1) // => T: number | undefined (reactive)
 *    userPoints.has(user1) // => T: boolean (reactive)
 * });
 * // apply changes
 * userPoints.set(user1, 100);
 * userPoints.delete(user2);
 * userPoints.set(user1, { foo: "bar" });
 */
declare class ReactiveWeakMap<K extends object, V> extends WeakMap<K, V> {
    #private;
    constructor(initial?: Iterable<readonly [K, V]> | null);
    has(key: K): boolean;
    get(key: K): V | undefined;
    set(key: K, value: V): this;
    delete(key: K): boolean;
}
/** @deprecated */
type SignalMap<K, V> = Accessor<[K, V][]> & ReactiveMap<K, V>;
/** @deprecated */
declare function createMap<K, V>(initial?: [K, V][]): SignalMap<K, V>;
/** @deprecated */
declare function createWeakMap<K extends object, V>(initial?: [K, V][]): ReactiveWeakMap<K, V>;

export { ReactiveMap, ReactiveWeakMap, SignalMap, createMap, createWeakMap };
