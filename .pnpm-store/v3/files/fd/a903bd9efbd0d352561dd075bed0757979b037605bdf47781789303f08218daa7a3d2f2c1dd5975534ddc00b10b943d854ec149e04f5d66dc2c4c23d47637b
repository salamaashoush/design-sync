type Trigger = [track: VoidFunction, dirty: VoidFunction];
/**
 * Set listeners in reactive computations and then trigger them when you want.
 * @returns `[track function, dirty function]`
 * @example
 * const [track, dirty] = createTrigger()
 * createEffect(() => {
 *    track()
 *    ...
 * })
 * // later
 * dirty()
 */
declare function createTrigger(): Trigger;
declare class TriggerCache<T> {
    #private;
    constructor(mapConstructor?: WeakMapConstructor | MapConstructor);
    dirty(key: T): void;
    track(key: T): void;
}
/**
 * Creates a cache of triggers that can be used to mark dirty only specific keys.
 *
 * Cache is a `Map` or `WeakMap` depending on the `mapConstructor` argument. (default: `Map`)
 *
 * If `mapConstructor` is `WeakMap` then the cache will be weak and the keys will be garbage collected when they are no longer referenced.
 *
 * Trigger signals added to the cache only when tracked under a computation,
 * and get deleted from the cache when they are no longer tracked.
 *
 * @returns a tuple of `[track, dirty]` functions
 *
 * `track` and `dirty` are called with a `key` so that each tracker will trigger an update only when his individual `key` would get marked as dirty.
 * @example
 * const [track, dirty] = createTriggerCache()
 * createEffect(() => {
 *    track(1)
 *    ...
 * })
 * // later
 * dirty(1)
 * // this won't cause an update:
 * dirty(2)
 */
declare function createTriggerCache<T>(mapConstructor?: WeakMapConstructor | MapConstructor): [track: (key: T) => void, dirty: (key: T) => void];

export { Trigger, TriggerCache, createTrigger, createTriggerCache };
