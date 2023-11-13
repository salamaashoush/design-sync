import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId } from "solid-js";
import { createDisclosureState, createPresence, createRegisterId } from "../primitives";
import { DialogContext } from "./dialog-context";
/**
 * A dialog is a window overlaid on either the primary window or another dialog window.
 */
export function DialogRoot(props) {
    const defaultId = `dialog-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        modal: true,
        preventScroll: false,
    }, props);
    const [contentId, setContentId] = createSignal();
    const [titleId, setTitleId] = createSignal();
    const [descriptionId, setDescriptionId] = createSignal();
    const [triggerRef, setTriggerRef] = createSignal();
    const disclosureState = createDisclosureState({
        open: () => props.open,
        defaultOpen: () => props.defaultOpen,
        onOpenChange: isOpen => props.onOpenChange?.(isOpen),
    });
    const shouldMount = () => props.forceMount || disclosureState.isOpen();
    const overlayPresence = createPresence(shouldMount);
    const contentPresence = createPresence(shouldMount);
    const context = {
        isOpen: disclosureState.isOpen,
        modal: () => props.modal ?? true,
        preventScroll: () => props.preventScroll ?? false,
        contentId,
        titleId,
        descriptionId,
        triggerRef,
        overlayPresence,
        contentPresence,
        close: disclosureState.close,
        toggle: disclosureState.toggle,
        setTriggerRef,
        generateId: createGenerateId(() => props.id),
        registerContentId: createRegisterId(setContentId),
        registerTitleId: createRegisterId(setTitleId),
        registerDescriptionId: createRegisterId(setDescriptionId),
    };
    return <DialogContext.Provider value={context}>{props.children}</DialogContext.Provider>;
}
