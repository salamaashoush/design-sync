import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useDialogContext } from "./dialog-context";
/**
 * An optional accessible description to be announced when the dialog is open.
 */
export function DialogDescription(props) {
    const context = useDialogContext();
    props = mergeDefaultProps({
        id: context.generateId("description"),
    }, props);
    const [local, others] = splitProps(props, ["id"]);
    createEffect(() => onCleanup(context.registerDescriptionId(local.id)));
    return <Polymorphic as="p" id={local.id} {...others}/>;
}
