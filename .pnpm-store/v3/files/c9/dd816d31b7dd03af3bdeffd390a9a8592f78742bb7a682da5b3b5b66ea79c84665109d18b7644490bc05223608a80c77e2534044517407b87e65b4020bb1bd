import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { useToastContext } from "./toast-context";
/**
 * An accessible title to be announced when the toast is open.
 */
export function ToastTitle(props) {
    const context = useToastContext();
    props = mergeDefaultProps({
        id: context.generateId("title"),
    }, props);
    const [local, others] = splitProps(props, ["id"]);
    createEffect(() => onCleanup(context.registerTitleId(local.id)));
    return <Polymorphic as="div" id={local.id} {...others}/>;
}
