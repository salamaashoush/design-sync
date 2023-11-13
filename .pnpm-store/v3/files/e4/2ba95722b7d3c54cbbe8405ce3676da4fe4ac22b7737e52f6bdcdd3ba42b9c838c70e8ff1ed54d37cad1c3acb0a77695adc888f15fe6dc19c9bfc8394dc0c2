import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import * as Listbox from "../listbox";
import { useSelectContext } from "./select-context";
/**
 * Contains all the items of a `Select`.
 */
export function SelectListbox(props) {
    const context = useSelectContext();
    props = mergeDefaultProps({
        id: context.generateId("listbox"),
    }, props);
    const [local, others] = splitProps(props, ["ref", "id", "onKeyDown"]);
    createEffect(() => onCleanup(context.registerListboxId(local.id)));
    const onKeyDown = e => {
        callHandler(e, local.onKeyDown);
        // Prevent from clearing the selection by `createSelectableCollection` on escape.
        if (e.key === "Escape") {
            e.preventDefault();
        }
    };
    return (<Listbox.Root ref={mergeRefs(context.setListboxRef, local.ref)} id={local.id} state={context.listState()} virtualized={context.isVirtualized()} autoFocus={context.autoFocus()} shouldSelectOnPressUp shouldFocusOnHover shouldFocusWrap={context.shouldFocusWrap()} disallowTypeAhead={context.disallowTypeAhead()} aria-labelledby={context.listboxAriaLabelledBy()} renderItem={context.renderItem} renderSection={context.renderSection} onKeyDown={onKeyDown} {...others}/>);
}
