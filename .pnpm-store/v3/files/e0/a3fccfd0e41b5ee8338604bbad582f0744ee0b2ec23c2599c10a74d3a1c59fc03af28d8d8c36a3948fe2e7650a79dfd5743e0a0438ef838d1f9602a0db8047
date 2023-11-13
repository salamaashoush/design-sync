import { access, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";
import { useFormControlContext } from "./form-control-context";
export const FORM_CONTROL_FIELD_PROP_NAMES = [
    "id",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
];
export function createFormControlField(props) {
    const context = useFormControlContext();
    props = mergeDefaultProps({ id: context.generateId("field") }, props);
    createEffect(() => onCleanup(context.registerField(access(props.id))));
    return {
        fieldProps: {
            id: () => access(props.id),
            ariaLabel: () => access(props["aria-label"]),
            ariaLabelledBy: () => context.getAriaLabelledBy(access(props.id), access(props["aria-label"]), access(props["aria-labelledby"])),
            ariaDescribedBy: () => context.getAriaDescribedBy(access(props["aria-describedby"])),
        },
    };
}
