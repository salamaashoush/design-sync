import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useFormControlContext } from "./form-control-context";
/**
 * The description that gives the user more information on the form control.
 */
export function FormControlDescription(props) {
    const context = useFormControlContext();
    props = mergeDefaultProps({
        id: context.generateId("description"),
    }, props);
    createEffect(() => onCleanup(context.registerDescription(props.id)));
    return <Polymorphic as="div" {...context.dataset()} {...props}/>;
}
