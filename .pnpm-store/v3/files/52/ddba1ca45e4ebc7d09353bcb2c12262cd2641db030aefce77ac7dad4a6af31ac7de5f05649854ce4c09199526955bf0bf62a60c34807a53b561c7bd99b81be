import { I as ItemsOf, g as Modify, d as Many, A as AnyClass } from '../types-38269011.js';
import 'solid-js';

/** make shallow copy of an array */
declare const shallowArrayCopy: <T>(array: readonly T[]) => T[];
/** make shallow copy of an object */
declare const shallowObjectCopy: <T extends object>(object: T) => T;
/** make shallow copy of an array/object */
declare const shallowCopy: <T extends object>(source: T) => T;
/**
 * apply mutations to the an array without changing the original
 * @param array original array
 * @param mutator function applying mutations to the copy of source
 * @returns changed array copy
 */
declare const withArrayCopy: <T>(array: readonly T[], mutator: (copy: T[]) => void) => T[];
/**
 * apply mutations to the an object without changing the original
 * @param object original object
 * @param mutator function applying mutations to the copy of source
 * @returns changed object copy
 */
declare const withObjectCopy: <T extends object>(object: T, mutator: (copy: T) => void) => T;
/**
 * apply mutations to the an object/array without changing the original
 * @param source original object
 * @param mutator function applying mutations to the copy of source
 * @returns changed object copy
 */
declare const withCopy: <T extends object>(source: T, mutator: (copy: T) => void) => T;

/** `a + b + c + ...` */
declare function add(...a: number[]): number;
declare function add(...a: string[]): string;
/** `a - b - c - ...` */
declare const substract: (a: number, ...b: number[]) => number;
/** `a * b * c * ...` */
declare const multiply: (a: number, ...b: number[]) => number;
/** `a / b / c / ...` */
declare const divide: (a: number, ...b: number[]) => number;
/** `a ** b ** c ** ...` */
declare const power: (a: number, ...b: number[]) => number;
/** clamp a number value between two other values */
declare const clamp: (n: number, min: number, max: number) => number;

type Predicate<T> = (item: T, index: number, array: readonly T[]) => boolean;
type MappingFn<T, V> = (item: T, index: number, array: readonly T[]) => V;
type FlattenArray<T> = T extends any[] ? FlattenArray<ItemsOf<T>> : T;
type ModifyValue<O, K extends keyof O, V> = Omit<O, K> & {
    [key in K]: V;
};

type UpdateSetter<O, K extends keyof O, V> = V | ((prev: O[K]) => V);
type Update = {
    <O extends object, K0 extends keyof O, K1 extends keyof O[K0], K2 extends keyof O[K0][K1], K3 extends keyof O[K0][K1][K2], K4 extends keyof O[K0][K1][K2][K3], V>(object: O, k0: K0, k1: K1, k2: K2, k3: K3, k4: K4, setter: UpdateSetter<O[K0][K1][K2][K3], K4, V>): ModifyValue<O, K0, ModifyValue<O[K0], K1, ModifyValue<O[K0][K1], K2, ModifyValue<O[K0][K1][K2], K3, ModifyValue<O[K0][K1][K2][K3], K4, V>>>>>;
    <O extends object, K0 extends keyof O, K1 extends keyof O[K0], K2 extends keyof O[K0][K1], K3 extends keyof O[K0][K1][K2], V>(object: O, k0: K0, k1: K1, k2: K2, k3: K3, setter: UpdateSetter<O[K0][K1][K2], K3, V>): ModifyValue<O, K0, ModifyValue<O[K0], K1, ModifyValue<O[K0][K1], K2, ModifyValue<O[K0][K1][K2], K3, V>>>>;
    <O extends object, K0 extends keyof O, K1 extends keyof O[K0], K2 extends keyof O[K0][K1], V>(object: O, k0: K0, k1: K1, k2: K2, setter: UpdateSetter<O[K0][K1], K2, V>): ModifyValue<O, K0, ModifyValue<O[K0], K1, ModifyValue<O[K0][K1], K2, V>>>;
    <O extends object, K0 extends keyof O, K1 extends keyof O[K0], V>(object: O, k0: K0, k1: K1, setter: UpdateSetter<O[K0], K1, V>): ModifyValue<O, K0, ModifyValue<O[K0], K1, V>>;
    <O extends object, K extends keyof O, V>(object: O, key: K, setter: UpdateSetter<O, K, V>): ModifyValue<O, K, V>;
};
/**
 * Change single value in an object by key. Allows accessign nested objects by passing multiple keys.
 *
 * Performs a shallow copy of each accessed object.
 *
 * @param object original source
 * @param ...keys keys of sequential accessed objects
 * @param value a value to set in place of a previous one, or a setter function.
 * ```ts
 * V | ((prev: O[K]) => V)
 * ```
 * a new value doesn't have to have the same type as the original
 * @returns changed copy of the original object
 *
 * @example
 * const original = { foo: { bar: { baz: 123 }}};
 * const newObj = update(original, "foo", "bar", "baz", prev => prev + 1)
 * original // { foo: { bar: { baz: 123 }}}
 * newObj // { foo: { bar: { baz: 124 }}}
 */
declare const update: Update;

/**
 * Create a new subset object without the provided keys
 *
 * @example
 * ```ts
 * const newObject = omit({ a:"foo", b:"bar", c: "baz" }, 'a', 'b')
 * newObject // => { c: "baz" }
 * ```
 */
declare const omit: <O extends object, K extends keyof O>(object: O, ...keys: K[]) => Omit<O, K>;
/**
 * Create a new subset object with only the provided keys
 *
 * @example
 * ```ts
 * const newObject = pick({ a:"foo", b:"bar", c: "baz" }, 'a', 'b')
 * newObject // => { a:"foo", b:"bar" }
 * ```
 */
declare const pick: <O extends object, K extends keyof O>(object: O, ...keys: K[]) => Pick<O, K>;
/**
 * Get a single property value of an object by specifying a path to it.
 */
declare function get<O extends object, K extends keyof O>(obj: O, key: K): O[K];
declare function get<O extends object, K1 extends keyof O, K2 extends keyof O[K1]>(obj: O, k1: K1, k2: K2): O[K1][K2];
declare function get<O extends object, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2]>(obj: O, k1: K1, k2: K2, k3: K3): O[K1][K2][K3];
declare function get<O extends object, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3]>(obj: O, k1: K1, k2: K2, k3: K3, k4: K4): O[K1][K2][K3][K4];
declare function get<O extends object, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4]>(obj: O, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): O[K1][K2][K3][K4][K5];
declare function get<O extends object, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2], K4 extends keyof O[K1][K2][K3], K5 extends keyof O[K1][K2][K3][K4], K6 extends keyof O[K1][K2][K3][K4][K5]>(obj: O, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6): O[K1][K2][K3][K4][K5][K6];
/**
 * Split object properties by keys into multiple object copies with a subset of selected properties.
 *
 * @param object original object
 * @param ...keys keys to pick from the source, or multiple arrays of keys *(for splitting into more than 2 objects)*
 * ```ts
 * (keyof object)[][] | (keyof object)[]
 * ```
 * @returns array of subset objects
 */
declare function split<T extends object, K extends keyof T>(object: T, ...keys: K[]): [Pick<T, K>, Omit<T, K>];
declare function split<T extends object, K1 extends keyof T, K2 extends keyof T>(object: T, ...keys: [K1[], K2[]]): [Pick<T, K1>, Pick<T, K2>, Omit<T, K1 | K2>];
declare function split<T extends object, K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(object: T, ...keys: [K1[], K2[], K3[]]): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Omit<T, K1 | K2 | K3>];
declare function split<T extends object, K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(object: T, ...keys: [K1[], K2[], K3[], K4[]]): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Pick<T, K4>, Omit<T, K1 | K2 | K3 | K4>];
declare function split<T extends object, K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(object: T, ...keys: [K1[], K2[], K3[], K4[], K5[]]): [
    Pick<T, K1>,
    Pick<T, K2>,
    Pick<T, K3>,
    Pick<T, K4>,
    Pick<T, K5>,
    Omit<T, K1 | K2 | K3 | K4 | K5>
];
/**
 * Merges multiple objects into a single one. Only the first level of properties is merged. An alternative to `{ ...a, ...b, ...c }`.
 * @param ...objects objects to merge
 * @example
 * const d = merge(a, b, c)
 */
declare function merge<A extends object, B extends object>(a: A, b: B): Modify<A, B>;
declare function merge<A extends object, B extends object, C extends object>(a: A, b: B, c: C): Modify<Modify<A, B>, C>;
declare function merge<A extends object, B extends object, C extends object, D extends object>(a: A, b: B, c: C, d: D): Modify<Modify<Modify<A, B>, C>, D>;
declare function merge<A extends object, B extends object, C extends object, D extends object, E extends object>(a: A, b: B, c: C, d: D, e: E): Modify<Modify<Modify<Modify<A, B>, C>, D>, E>;
declare function merge<A extends object, B extends object, C extends object, D extends object, E extends object, F extends object>(a: A, b: B, c: C, d: D, e: E, f: F): Modify<Modify<Modify<Modify<Modify<A, B>, C>, D>, E>, F>;

/**
 * non-mutating `Array.prototype.push()`
 * @returns changed array copy
 */
declare const push: <T>(list: readonly T[], ...items: T[]) => T[];
/**
 * non-mutating function that drops n items from the array start.
 * @returns changed array copy
 *
 * @example
 * ```ts
 * const newList = drop([1,2,3])
 * newList // => [2,3]
 *
 * const newList = drop([1,2,3], 2)
 * newList // => [3]
 * ```
 */
declare const drop: <T>(list: T[], n?: number) => T[];
/**
 * non-mutating function that drops n items from the array end.
 * @returns changed array copy
 *
 * @example
 * ```ts
 * const newList = dropRight([1,2,3])
 * newList // => [1,2]
 *
 * const newList = dropRight([1,2,3], 2)
 * newList // => [1]
 * ```
 */
declare const dropRight: <T>(list: T[], n?: number) => T[];
/**
 * standalone `Array.prototype.filter()` that filters out passed item
 * @returns changed array copy
 */
declare const filterOut: <T>(list: readonly T[], item: T) => T[] & {
    removed: number;
};
/**
 * standalone `Array.prototype.filter()`
 * @returns changed array copy
 */
declare function filter<T>(list: readonly T[], predicate: Predicate<T>): T[] & {
    removed: number;
};
/**
 * non-mutating `Array.prototype.sort()` as a standalone function
 * @returns changed array copy
 */
declare const sort: <T>(list: T[], compareFn?: ((a: T, b: T) => number) | undefined) => T[];
/**
 * standalone `Array.prototype.map()` function
 */
declare const map: <T, V>(list: readonly T[], mapFn: MappingFn<T, V>) => V[];
/**
 * standalone `Array.prototype.slice()` function
 */
declare const slice: <T>(list: readonly T[], start?: number, end?: number) => T[];
/**
 * non-mutating `Array.prototype.splice()` as a standalone function
 * @returns changed array copy
 */
declare const splice: <T>(list: readonly T[], start: number, deleteCount?: number, ...items: T[]) => T[];
/**
 * non-mutating `Array.prototype.fill()` as a standalone function
 * @returns changed array copy
 */
declare const fill: <T>(list: readonly T[], value: T, start?: number, end?: number) => T[];
/**
 * Creates a new array concatenating array with any additional arrays and/or values.
 * @param ...a values or arrays
 * @returns new concatenated array
 */
declare function concat<A extends any[], V extends ItemsOf<A>>(...a: A): Array<V extends any[] ? ItemsOf<V> : V>;
/**
 * Remove item from array
 * @returns changed array copy
 */
declare const remove: <T>(list: readonly T[], item: T, ...insertItems: T[]) => T[];
/**
 * Remove multiple items from an array
 * @returns changed array copy
 */
declare const removeItems: <T>(list: readonly T[], ...items: T[]) => T[];
/**
 * Flattens a nested array into a one-level array
 * @returns changed array copy
 */
declare const flatten: <T extends any[]>(arr: T) => FlattenArray<T>[];
/**
 * Sort an array by object key, or multiple keys
 * @returns changed array copy
 */
declare const sortBy: <T>(arr: T[], ...paths: T extends object ? (Many<keyof T> | Many<(item: T) => any>)[] : Many<(item: T) => any>[]) => T[];
/**
 * Returns a subset of items that are instances of provided Classes
 * @param list list of original items
 * @param ...classes list or classes
 * @returns changed array copy
 */
declare const filterInstance: <T, I extends AnyClass[]>(list: readonly T[], ...classes: I) => Extract<T, InstanceType<ItemsOf<I>>>[];
/**
 * Returns a subset of items that aren't instances of provided Classes
 * @param list list of original items
 * @param ...classes list or classes
 * @returns changed array copy
 */
declare const filterOutInstance: <T, I extends AnyClass[]>(list: readonly T[], ...classes: I) => Exclude<T, InstanceType<ItemsOf<I>>>[];

export { FlattenArray, MappingFn, ModifyValue, Predicate, Update, UpdateSetter, add, clamp, concat, divide, drop, dropRight, fill, filter, filterInstance, filterOut, filterOutInstance, flatten, get, map, merge, multiply, omit, pick, power, push, remove, removeItems, shallowArrayCopy, shallowCopy, shallowObjectCopy, slice, sort, sortBy, splice, split, substract, update, withArrayCopy, withCopy, withObjectCopy };
