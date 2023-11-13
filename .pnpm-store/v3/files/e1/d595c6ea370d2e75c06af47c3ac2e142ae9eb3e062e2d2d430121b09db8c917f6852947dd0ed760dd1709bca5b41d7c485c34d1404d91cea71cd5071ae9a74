import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useToastContext } from "./toast-context";
/**
 * An optional accessible description to be announced when the toast is open.
 */
export function ToastDescription(props) {
    const context = useToastContext();
    props = mergeDefaultProps({
        id: context.generateId("description"),
    }, props);
    const [local, others] = splitProps(props, ["id"]);
    createEffect(() => onCleanup(context.registerDescriptionId(local.id)));
    return <Polymorphic as="div" id={local.id} {...others}/>;
}
