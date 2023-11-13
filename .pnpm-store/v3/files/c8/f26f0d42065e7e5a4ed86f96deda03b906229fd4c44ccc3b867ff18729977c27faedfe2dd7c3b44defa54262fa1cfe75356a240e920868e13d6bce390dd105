import { createMemo, splitProps } from "solid-js";
import { SelectBase } from "./select-base";
/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export function SelectRoot(props) {
    const [local, others] = splitProps(props, ["value", "defaultValue", "onChange", "multiple"]);
    const value = createMemo(() => {
        if (local.value != null) {
            return local.multiple ? local.value : [local.value];
        }
        return local.value;
    });
    const defaultValue = createMemo(() => {
        if (local.defaultValue != null) {
            return local.multiple ? local.defaultValue : [local.defaultValue];
        }
        return local.defaultValue;
    });
    const onChange = (value) => {
        if (local.multiple) {
            local.onChange?.(value);
        }
        else {
            // use `null` as "no value" because `undefined` mean the component is "uncontrolled".
            local.onChange?.((value[0] ?? null));
        }
    };
    return (<SelectBase value={value()} defaultValue={defaultValue()} onChange={onChange} selectionMode={local.multiple ? "multiple" : "single"} {...others}/>);
}
