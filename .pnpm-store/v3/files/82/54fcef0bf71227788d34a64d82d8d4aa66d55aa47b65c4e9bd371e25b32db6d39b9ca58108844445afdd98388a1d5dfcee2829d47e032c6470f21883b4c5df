import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";
import { useRadioGroupItemContext } from "./radio-group-item-context";
/**
 * The label that gives the user information on the radio button.
 */
export function RadioGroupItemLabel(props) {
    const context = useRadioGroupItemContext();
    props = mergeDefaultProps({
        id: context.generateId("label"),
    }, props);
    createEffect(() => onCleanup(context.registerLabel(props.id)));
    return <label for={context.inputId()} {...context.dataset()} {...props}/>;
}
