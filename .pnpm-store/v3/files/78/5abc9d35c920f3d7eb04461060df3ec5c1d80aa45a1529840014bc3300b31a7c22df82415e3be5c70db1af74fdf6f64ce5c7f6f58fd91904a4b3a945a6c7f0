/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/popover/popover-state.ts
 */
import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, splitProps, } from "solid-js";
import { PopperRoot } from "../popper";
import { createDisclosureState, createPresence, createRegisterId } from "../primitives";
import { PopoverContext } from "./popover-context";
/**
 * A popover is a dialog positioned relative to an anchor element.
 */
export function PopoverRoot(props) {
    const defaultId = `popover-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        modal: false,
        preventScroll: false,
    }, props);
    const [local, others] = splitProps(props, [
        "id",
        "open",
        "defaultOpen",
        "onOpenChange",
        "modal",
        "preventScroll",
        "forceMount",
        "anchorRef",
    ]);
    const [defaultAnchorRef, setDefaultAnchorRef] = createSignal();
    const [triggerRef, setTriggerRef] = createSignal();
    const [contentRef, setContentRef] = createSignal();
    const [contentId, setContentId] = createSignal();
    const [titleId, setTitleId] = createSignal();
    const [descriptionId, setDescriptionId] = createSignal();
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen),
    });
    const anchorRef = () => {
        return local.anchorRef?.() ?? defaultAnchorRef() ?? triggerRef();
    };
    const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());
    const dataset = createMemo(() => ({
        "data-expanded": disclosureState.isOpen() ? "" : undefined,
        "data-closed": !disclosureState.isOpen() ? "" : undefined,
    }));
    const context = {
        dataset,
        isOpen: disclosureState.isOpen,
        isModal: () => local.modal ?? false,
        preventScroll: () => local.preventScroll ?? false,
        contentPresence,
        triggerRef,
        contentId,
        titleId,
        descriptionId,
        setDefaultAnchorRef,
        setTriggerRef,
        setContentRef,
        close: disclosureState.close,
        toggle: disclosureState.toggle,
        generateId: createGenerateId(() => local.id),
        registerContentId: createRegisterId(setContentId),
        registerTitleId: createRegisterId(setTitleId),
        registerDescriptionId: createRegisterId(setDescriptionId),
    };
    return (<PopoverContext.Provider value={context}>
      <PopperRoot anchorRef={anchorRef} contentRef={contentRef} {...others}/>
    </PopoverContext.Provider>);
}
