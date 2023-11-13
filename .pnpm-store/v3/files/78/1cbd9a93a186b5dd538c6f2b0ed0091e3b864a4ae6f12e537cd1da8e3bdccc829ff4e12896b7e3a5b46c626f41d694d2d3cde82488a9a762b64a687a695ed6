import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, Show, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useFormControlContext } from "./form-control-context";
/**
 * The error message that gives the user information about how to fix a validation error on the form control.
 */
export function FormControlErrorMessage(props) {
    const context = useFormControlContext();
    props = mergeDefaultProps({
        id: context.generateId("error-message"),
    }, props);
    const [local, others] = splitProps(props, ["forceMount"]);
    const isInvalid = () => context.validationState() === "invalid";
    createEffect(() => {
        if (!isInvalid()) {
            return;
        }
        onCleanup(context.registerErrorMessage(others.id));
    });
    return (<Show when={local.forceMount || isInvalid()}>
      <Polymorphic as="div" {...context.dataset()} {...others}/>
    </Show>);
}
