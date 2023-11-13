import { Accessor, Setter } from 'solid-js';

/**
 * Can be single or in an array
 */
type Many<T> = T | T[];
type Values<O extends Object> = O[keyof O];
type Noop = (...a: any[]) => void;
type Directive<P = true> = (el: Element, props: Accessor<P>) => void;
/**
 * Infers the type of the array elements
 */
type ItemsOf<T> = T extends (infer E)[] ? E : never;
type ItemsOfMany<T> = T extends any[] ? ItemsOf<T> : T;
type SetterParam<T> = Parameters<Setter<T>>[0];
/**
 * T or a reactive/non-reactive function returning T
 */
type MaybeAccessor<T> = T | Accessor<T>;
/**
 * Accessed value of a MaybeAccessor
 * @example
 * ```ts
 * MaybeAccessorValue<MaybeAccessor<string>>
 * // => string
 * MaybeAccessorValue<MaybeAccessor<() => string>>
 * // => string | (() => string)
 * MaybeAccessorValue<MaybeAccessor<string> | Function>
 * // => string | void
 * ```
 */
type MaybeAccessorValue<T extends MaybeAccessor<any>> = T extends () => any ? ReturnType<T> : T;
type OnAccessEffectFunction<S, Prev, Next extends Prev = Prev> = (input: AccessReturnTypes<S>, prevInput: AccessReturnTypes<S>, v: Prev) => Next;
type AccessReturnTypes<S> = S extends MaybeAccessor<any>[] ? {
    [I in keyof S]: AccessReturnTypes<S[I]>;
} : MaybeAccessorValue<S>;
/** Allows to make shallow overwrites to an interface */
type Modify<T, R> = Omit<T, keyof R> & R;
/** Allows to make nested overwrites to an interface */
type ModifyDeep<A extends AnyObject, B extends DeepPartialAny<A>> = {
    [K in keyof A]: B[K] extends never ? A[K] : B[K] extends AnyObject ? ModifyDeep<A[K], B[K]> : B[K];
} & (A extends AnyObject ? Omit<B, keyof A> : A);
/** Makes each property optional and turns each leaf property into any, allowing for type overrides by narrowing any. */
type DeepPartialAny<T> = {
    [P in keyof T]?: T[P] extends AnyObject ? DeepPartialAny<T[P]> : any;
};
/** Removes the `[...list]` functionality */
type NonIterable<T> = T & {
    [Symbol.iterator]: never;
};
/** Get the required keys of an object */
type RequiredKeys<T> = keyof {
    [K in keyof T as T extends {
        [_ in K]: unknown;
    } ? K : never]: 0;
};
/** Remove the first item of a tuple [1, 2, 3, 4] => [2, 3, 4] */
type Tail<T extends any[]> = ((...t: T) => void) extends (x: any, ...u: infer U) => void ? U : never;
/** `A | B => A & B` */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type ExtractIfPossible<T, U> = Extract<T, U> extends never ? U : Extract<T, U>;
type AnyObject = Record<PropertyKey, any>;
type AnyStatic = [] | any[] | AnyObject;
type AnyFunction = (...args: any[]) => any;
type AnyClass = abstract new (...args: any) => any;
type PrimitiveValue = PropertyKey | boolean | bigint | null | undefined;
type FalsyValue = false | 0 | "" | null | undefined;
type Truthy<T> = Exclude<T, FalsyValue>;
type Falsy<T> = Extract<T, FalsyValue>;
type Position = {
    x: number;
    y: number;
};
type Size = {
    width: number;
    height: number;
};
/** Unwraps the type definition of an object, making it more readable */
type Simplify<T> = T extends object ? {
    [K in keyof T]: T[K];
} : T;
/** Unboxes type definition, making it more readable */
type UnboxLazy<T> = T extends () => infer U ? U : T;
type RawNarrow<T> = (T extends [] ? [] : never) | (T extends string | number | bigint | boolean ? T : never) | {
    [K in keyof T]: T[K] extends Function ? T[K] : RawNarrow<T[K]>;
};
type Narrow<T extends any> = T extends [] ? T : RawNarrow<T>;
type NoInfer<T> = [T][T extends any ? 0 : never];

export { AnyClass as A, Directive as D, ExtractIfPossible as E, FalsyValue as F, ItemsOf as I, MaybeAccessorValue as M, Noop as N, OnAccessEffectFunction as O, PrimitiveValue as P, RequiredKeys as R, SetterParam as S, Tail as T, UnionToIntersection as U, Values as V, AnyObject as a, MaybeAccessor as b, AnyFunction as c, Many as d, ItemsOfMany as e, AccessReturnTypes as f, Modify as g, ModifyDeep as h, DeepPartialAny as i, NonIterable as j, AnyStatic as k, Truthy as l, Falsy as m, Position as n, Size as o, Simplify as p, UnboxLazy as q, Narrow as r, NoInfer as s };
