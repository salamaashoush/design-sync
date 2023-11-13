import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { createTagName } from "../primitives";
import { useFormControlContext } from "./form-control-context";
/**
 * The label that gives the user information on the form control.
 */
export function FormControlLabel(props) {
    let ref;
    const context = useFormControlContext();
    props = mergeDefaultProps({
        id: context.generateId("label"),
    }, props);
    const [local, others] = splitProps(props, ["ref"]);
    const tagName = createTagName(() => ref, () => "label");
    createEffect(() => onCleanup(context.registerLabel(others.id)));
    return (<Polymorphic as="label" ref={mergeRefs(el => (ref = el), local.ref)} for={tagName() === "label" ? context.fieldId() : undefined} {...context.dataset()} {...others}/>);
}
