import { accessWith } from "@kobalte/utils";
import { createMemo, createSignal, untrack } from "solid-js";
/**
 * Creates a simple reactive state with a getter and setter,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableSignal(props) {
    // Internal uncontrolled value
    // eslint-disable-next-line solid/reactivity
    const [_value, _setValue] = createSignal(props.defaultValue?.());
    const isControlled = createMemo(() => props.value?.() !== undefined);
    const value = createMemo(() => (isControlled() ? props.value?.() : _value()));
    const setValue = (next) => {
        untrack(() => {
            const nextValue = accessWith(next, value());
            if (!Object.is(nextValue, value())) {
                if (!isControlled()) {
                    _setValue(nextValue);
                }
                props.onChange?.(nextValue);
            }
            return nextValue;
        });
    };
    return [value, setValue];
}
/**
 * Creates a simple reactive Boolean state with a getter, setter and a fallback value of `false`,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableBooleanSignal(props) {
    const [_value, setValue] = createControllableSignal(props);
    const value = () => _value() ?? false;
    return [value, setValue];
}
/**
 * Creates a simple reactive Array state with a getter, setter and a fallback value of `[]`,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableArraySignal(props) {
    const [_value, setValue] = createControllableSignal(props);
    const value = () => _value() ?? [];
    return [value, setValue];
}
/**
 * Creates a simple reactive Set state with a getter, setter and a fallback value of `Set()`,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableSetSignal(props) {
    const [_value, setValue] = createControllableSignal(props);
    const value = () => _value() ?? new Set();
    return [value, setValue];
}
