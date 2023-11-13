/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard.tsx
 */
import { contains, createGlobalListeners, getEventPoint, isPointInPolygon, mergeDefaultProps, } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, createUniqueId, onCleanup, splitProps, } from "solid-js";
import { isServer } from "solid-js/web";
import { PopperRoot } from "../popper";
import { createDisclosureState, createPresence } from "../primitives";
import { HoverCardContext } from "./hover-card-context";
import { getHoverCardSafeArea } from "./utils";
/**
 * A popover that allows sighted users to preview content available behind a link.
 */
export function HoverCardRoot(props) {
    const defaultId = `hovercard-${createUniqueId()}`;
    props = mergeDefaultProps({
        id: defaultId,
        openDelay: 700,
        closeDelay: 300,
    }, props);
    const [local, others] = splitProps(props, [
        "id",
        "open",
        "defaultOpen",
        "onOpenChange",
        "openDelay",
        "closeDelay",
        "ignoreSafeArea",
        "forceMount",
    ]);
    let openTimeoutId;
    let closeTimeoutId;
    const [triggerRef, setTriggerRef] = createSignal();
    const [contentRef, setContentRef] = createSignal();
    const [currentPlacement, setCurrentPlacement] = createSignal(others.placement);
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen),
    });
    const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());
    const { addGlobalListener, removeGlobalListener } = createGlobalListeners();
    const openWithDelay = () => {
        if (isServer) {
            return;
        }
        openTimeoutId = window.setTimeout(() => {
            openTimeoutId = undefined;
            disclosureState.open();
        }, local.openDelay);
    };
    const closeWithDelay = () => {
        if (isServer) {
            return;
        }
        closeTimeoutId = window.setTimeout(() => {
            closeTimeoutId = undefined;
            disclosureState.close();
        }, local.closeDelay);
    };
    const cancelOpening = () => {
        if (isServer) {
            return;
        }
        window.clearTimeout(openTimeoutId);
        openTimeoutId = undefined;
    };
    const cancelClosing = () => {
        if (isServer) {
            return;
        }
        window.clearTimeout(closeTimeoutId);
        closeTimeoutId = undefined;
    };
    const isTargetOnHoverCard = (target) => {
        return contains(triggerRef(), target) || contains(contentRef(), target);
    };
    const getPolygonSafeArea = (placement) => {
        const triggerEl = triggerRef();
        const contentEl = contentRef();
        if (!triggerEl || !contentEl) {
            return;
        }
        return getHoverCardSafeArea(placement, triggerEl, contentEl);
    };
    const onHoverOutside = (event) => {
        const target = event.target;
        // Don't close if the mouse is moving through valid hovercard element.
        if (isTargetOnHoverCard(target)) {
            cancelClosing();
            return;
        }
        if (!local.ignoreSafeArea) {
            const polygon = getPolygonSafeArea(currentPlacement());
            //Don't close if the current's event mouse position is inside the polygon safe area.
            if (polygon && isPointInPolygon(getEventPoint(event), polygon)) {
                cancelClosing();
                return;
            }
        }
        // If there's already a scheduled timeout to hide the hovercard, we do nothing.
        if (closeTimeoutId) {
            return;
        }
        // Otherwise, hide the hovercard after the close delay.
        closeWithDelay();
    };
    createEffect(() => {
        if (!disclosureState.isOpen()) {
            return;
        }
        // Checks whether the mouse is moving outside the hovercard.
        // If yes, hide the card after the close delay.
        addGlobalListener(document, "pointermove", onHoverOutside, true);
        onCleanup(() => {
            removeGlobalListener(document, "pointermove", onHoverOutside, true);
        });
    });
    // cleanup all timeout on unmount.
    onCleanup(() => {
        cancelOpening();
        cancelClosing();
    });
    const dataset = createMemo(() => ({
        "data-expanded": disclosureState.isOpen() ? "" : undefined,
        "data-closed": !disclosureState.isOpen() ? "" : undefined,
    }));
    const context = {
        dataset,
        isOpen: disclosureState.isOpen,
        contentPresence,
        openWithDelay,
        closeWithDelay,
        cancelOpening,
        cancelClosing,
        close: disclosureState.close,
        isTargetOnHoverCard,
        setTriggerRef,
        setContentRef,
    };
    return (<HoverCardContext.Provider value={context}>
      <PopperRoot anchorRef={triggerRef} contentRef={contentRef} onCurrentPlacementChange={setCurrentPlacement} {...others}/>
    </HoverCardContext.Provider>);
}
