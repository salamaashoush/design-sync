import { createMemo, splitProps } from "solid-js";
import { ComboboxBase } from "./combobox-base";
/**
 * A combo box combines a text input with a listbox, allowing users to filter a list of options to items matching a query.
 */
export function ComboboxRoot(props) {
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
    return (<ComboboxBase value={value()} defaultValue={defaultValue()} onChange={onChange} selectionMode={local.multiple ? "multiple" : "single"} {...others}/>);
}
