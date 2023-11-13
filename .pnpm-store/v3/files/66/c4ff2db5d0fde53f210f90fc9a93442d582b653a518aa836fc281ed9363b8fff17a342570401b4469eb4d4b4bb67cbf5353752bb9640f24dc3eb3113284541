import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";
import { usePopoverContext } from "./popover-context";
/**
 * An optional accessible description to be announced when the popover is open.
 */
export function PopoverDescription(props) {
    const context = usePopoverContext();
    props = mergeDefaultProps({
        id: context.generateId("description"),
    }, props);
    const [local, others] = splitProps(props, ["id"]);
    createEffect(() => onCleanup(context.registerDescriptionId(local.id)));
    return <Polymorphic as="p" id={local.id} {...context.dataset()} {...others}/>;
}
