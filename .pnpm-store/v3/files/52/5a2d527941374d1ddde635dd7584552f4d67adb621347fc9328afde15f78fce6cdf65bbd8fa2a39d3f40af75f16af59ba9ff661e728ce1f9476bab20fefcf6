import { callHandler } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { FormControlLabel } from "../form-control";
import { useSelectContext } from "./select-context";
/**
 * The label that gives the user information on the select.
 */
export function SelectLabel(props) {
    const context = useSelectContext();
    const [local, others] = splitProps(props, ["onClick"]);
    const onClick = e => {
        callHandler(e, local.onClick);
        if (!context.isDisabled()) {
            context.triggerRef()?.focus();
        }
    };
    return <FormControlLabel as="span" onClick={onClick} {...others}/>;
}
