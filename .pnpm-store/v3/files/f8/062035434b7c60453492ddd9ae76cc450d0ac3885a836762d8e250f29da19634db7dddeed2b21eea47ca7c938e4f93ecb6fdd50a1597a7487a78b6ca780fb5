import { Accessor } from "solid-js";
export interface CreateControllableSignalProps<T> {
    /** The value to be used, in controlled mode. */
    value?: Accessor<T | undefined>;
    /** The initial value to be used, in uncontrolled mode. */
    defaultValue?: Accessor<T | undefined>;
    /** A function that will be called when the value changes. */
    onChange?: (value: T) => void;
}
/**
 * Creates a simple reactive state with a getter and setter,
 * that can be controlled with `value` and `onChange` props.
 */
export declare function createControllableSignal<T>(props: CreateControllableSignalProps<T>): readonly [Accessor<T>, (next: Exclude<T, Function> | ((prev: T) => T)) => void];
/**
 * Creates a simple reactive Boolean state with a getter, setter and a fallback value of `false`,
 * that can be controlled with `value` and `onChange` props.
 */
export declare function createControllableBooleanSignal(props: CreateControllableSignalProps<boolean>): readonly [Accessor<boolean>, (next: boolean | ((prev: boolean) => boolean)) => void];
/**
 * Creates a simple reactive Array state with a getter, setter and a fallback value of `[]`,
 * that can be controlled with `value` and `onChange` props.
 */
export declare function createControllableArraySignal<T>(props: CreateControllableSignalProps<Array<T>>): readonly [Accessor<T[]>, (next: T[] | ((prev: T[]) => T[])) => void];
/**
 * Creates a simple reactive Set state with a getter, setter and a fallback value of `Set()`,
 * that can be controlled with `value` and `onChange` props.
 */
export declare function createControllableSetSignal<T>(props: CreateControllableSignalProps<Set<T>>): readonly [Accessor<Set<T>>, (next: Set<T> | ((prev: Set<T>) => Set<T>)) => void];
