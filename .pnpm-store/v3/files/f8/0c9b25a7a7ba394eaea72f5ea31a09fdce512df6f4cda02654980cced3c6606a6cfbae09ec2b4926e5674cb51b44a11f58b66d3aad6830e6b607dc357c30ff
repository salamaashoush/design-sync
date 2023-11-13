import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useRadioGroupItemContext } from "./radio-group-item-context";
/**
 * The description that gives the user more information on the radio button.
 */
export function RadioGroupItemDescription(props) {
    const context = useRadioGroupItemContext();
    props = mergeDefaultProps({
        id: context.generateId("description"),
    }, props);
    createEffect(() => onCleanup(context.registerDescription(props.id)));
    return <Polymorphic as="div" {...context.dataset()} {...props}/>;
}
