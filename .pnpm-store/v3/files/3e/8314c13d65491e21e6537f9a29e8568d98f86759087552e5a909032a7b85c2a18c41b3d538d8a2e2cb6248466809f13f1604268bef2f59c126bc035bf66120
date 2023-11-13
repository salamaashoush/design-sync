import { Accessor, AccessorArray, NoInfer, EffectFunction, onCleanup, SignalOptions, createSignal } from 'solid-js';
export { isServer } from 'solid-js/web';
import { N as Noop, A as AnyClass, a as AnyObject, M as MaybeAccessorValue, b as MaybeAccessor, c as AnyFunction } from '../types-38269011.js';
export { f as AccessReturnTypes, k as AnyStatic, i as DeepPartialAny, D as Directive, E as ExtractIfPossible, m as Falsy, F as FalsyValue, I as ItemsOf, e as ItemsOfMany, d as Many, g as Modify, h as ModifyDeep, r as Narrow, s as NoInfer, j as NonIterable, O as OnAccessEffectFunction, n as Position, P as PrimitiveValue, R as RequiredKeys, S as SetterParam, p as Simplify, o as Size, T as Tail, l as Truthy, q as UnboxLazy, U as UnionToIntersection, V as Values } from '../types-38269011.js';
export { EffectOptions, OnOptions, ResolvedChildren, ResolvedJSXElement } from 'solid-js/types/reactive/signal';

declare const isClient: boolean;
declare const isDev: boolean;
declare const isProd: boolean;
/** no operation */
declare const noop: Noop;
declare const trueFn: () => boolean;
declare const falseFn: () => boolean;
/** @deprecated use {@link equalFn} from "solid-js" */
declare const defaultEquals: <T>(a: T, b: T) => boolean;
declare const EQUALS_FALSE_OPTIONS: {
    readonly equals: false;
};
declare const INTERNAL_OPTIONS: {
    readonly internal: true;
};
/**
 * Check if the value is an instance of ___
 */
declare const ofClass: (v: any, c: AnyClass) => boolean;
/** Check if value is typeof "object" or "function" */
declare function isObject(value: any): value is AnyObject;
declare const isNonNullable: <T>(i: T) => i is NonNullable<T>;
declare const filterNonNullable: <T extends readonly unknown[]>(arr: T) => NonNullable<T[number]>[];
declare const compare: (a: any, b: any) => number;
/**
 * Check shallow array equality
 */
declare const arrayEquals: (a: readonly unknown[], b: readonly unknown[]) => boolean;
/**
 * Returns a function that will call all functions in the order they were chained with the same arguments.
 */
declare function chain<Args extends [] | any[]>(callbacks: {
    [Symbol.iterator](): IterableIterator<((...args: Args) => any) | undefined>;
}): (...args: Args) => void;
/**
 * Returns a function that will call all functions in the reversed order with the same arguments.
 */
declare function reverseChain<Args extends [] | any[]>(callbacks: (((...args: Args) => any) | undefined)[]): (...args: Args) => void;
declare const clamp: (n: number, min: number, max: number) => number;
/**
 * Accesses the value of a MaybeAccessor
 * @example
 * ```ts
 * access("foo") // => "foo"
 * access(() => "foo") // => "foo"
 * ```
 */
declare const access: <T extends unknown>(v: T) => MaybeAccessorValue<T>;
declare const asArray: <T>(value: T) => (T extends any[] ? T[number] : NonNullable<T>)[];
/**
 * Access an array of MaybeAccessors
 * @example
 * const list = [1, 2, () => 3)] // T: MaybeAccessor<number>[]
 * const newList = accessArray(list) // T: number[]
 */
declare const accessArray: <A extends unknown>(list: readonly A[]) => MaybeAccessorValue<A>[];
/**
 * Run the function if the accessed value is not `undefined` nor `null`
 * @param value
 * @param fn
 */
declare const withAccess: <T, A extends MaybeAccessor<T>, V = MaybeAccessorValue<A>>(value: A, fn: (value: NonNullable<V>) => void) => void;
declare const asAccessor: <A extends unknown>(v: A) => Accessor<MaybeAccessorValue<A>>;
/** If value is a function – call it with a given arguments – otherwise get the value as is */
declare function accessWith<T>(valueOrFn: T, ...args: T extends AnyFunction ? Parameters<T> : never): T extends AnyFunction ? ReturnType<T> : T;
/**
 * Solid's `on` helper, but always defers and returns a provided initial value when if does instead of `undefined`.
 *
 * @param deps
 * @param fn
 * @param initialValue
 */
declare function defer<S, Next extends Prev, Prev = Next>(deps: AccessorArray<S> | Accessor<S>, fn: (input: S, prevInput: S, prev: undefined | NoInfer<Prev>) => Next, initialValue: Next): EffectFunction<undefined | NoInfer<Next>, NoInfer<Next>>;
declare function defer<S, Next extends Prev, Prev = Next>(deps: AccessorArray<S> | Accessor<S>, fn: (input: S, prevInput: S, prev: undefined | NoInfer<Prev>) => Next, initialValue?: undefined): EffectFunction<undefined | NoInfer<Next>>;
/**
 * Get entries of an object
 */
declare const entries: <T extends object>(obj: T) => [keyof T, T[keyof T]][];
/**
 * Get keys of an object
 */
declare const keys: <T extends object>(object: T) => (keyof T)[];
/**
 * Solid's `onCleanup` that doesn't warn in development if used outside of a component.
 */
declare const tryOnCleanup: typeof onCleanup;
declare const createCallbackStack: <A0 = void, A1 = void, A2 = void, A3 = void>() => {
    push: (...callbacks: ((arg0: A0, arg1: A1, arg2: A2, arg3: A3) => void)[]) => void;
    execute: (arg0: A0, arg1: A1, arg2: A2, arg3: A3) => void;
    clear: VoidFunction;
};
/**
 * Group synchronous function calls.
 * @param fn
 * @returns `fn`
 */
declare function createMicrotask<A extends any[] | []>(fn: (...a: A) => void): (...a: A) => void;
/**
 * A hydratable version of the {@link createSignal}. It will use the serverValue on the server and the update function on the client. If initialized during hydration it will use serverValue as the initial value and update it once hydration is complete.
 *
 * @param serverValue initial value of the state on the server
 * @param update called once on the client or on hydration to initialize the value
 * @param options {@link SignalOptions}
 * @returns
 * ```ts
 * [state: Accessor<T>, setState: Setter<T>]
 * ```
 * @see {@link createSignal}
 */
declare function createHydratableSignal<T>(serverValue: T, update: () => T, options?: SignalOptions<T>): ReturnType<typeof createSignal<T>>;
/** @deprecated use {@link createHydratableSignal} instead */
declare const createHydrateSignal: typeof createHydratableSignal;
/**
 * Handle items removed and added to the array by diffing it by refference.
 *
 * @param current new array instance
 * @param prev previous array copy
 * @param handleAdded called once for every added item to array
 * @param handleRemoved called once for every removed from array
 */
declare function handleDiffArray<T>(current: readonly T[], prev: readonly T[], handleAdded: (item: T) => void, handleRemoved: (item: T) => void): void;

export { AnyClass, AnyFunction, AnyObject, EQUALS_FALSE_OPTIONS, INTERNAL_OPTIONS, MaybeAccessor, MaybeAccessorValue, Noop, access, accessArray, accessWith, arrayEquals, asAccessor, asArray, chain, clamp, compare, createCallbackStack, createHydratableSignal, createHydrateSignal, createMicrotask, defaultEquals, defer, entries, falseFn, filterNonNullable, handleDiffArray, isClient, isDev, isNonNullable, isObject, isProd, keys, noop, ofClass, reverseChain, trueFn, tryOnCleanup, withAccess };
