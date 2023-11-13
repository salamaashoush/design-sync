/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/tooltip/tooltip.tsx
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e67d48d4935b772f915b08f1d695d2ebafb876f0/packages/@react-stately/tooltip/src/useTooltipTriggerState.ts
 */
import { contains, createGenerateId, getDocument, getEventPoint, getWindow, isPointInPolygon, mergeDefaultProps, } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, createUniqueId, onCleanup, splitProps, } from "solid-js";
import { isServer } from "solid-js/web";
import { PopperRoot } from "../popper";
import { createDisclosureState, createPresence, createRegisterId } from "../primitives";
import { TooltipContext } from "./tooltip-context";
import { getTooltipSafeArea } from "./utils";
const tooltips = {};
let tooltipsCounter = 0;
let globalWarmedUp = false;
let globalWarmUpTimeout;
let globalCoolDownTimeout;
/**
 * A popup that displays information related to an element
 * when the element receives keyboard focus or the mouse hovers over it.
 */
export function TooltipRoot(props) {
    const defaultId = `tooltip-${createUniqueId()}`;
    // This is not the DOM id.
    const tooltipId = `${++tooltipsCounter}`;
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
        "disabled",
        "triggerOnFocusOnly",
        "openDelay",
        "closeDelay",
        "ignoreSafeArea",
        "forceMount",
    ]);
    let closeTimeoutId;
    const [contentId, setContentId] = createSignal();
    const [triggerRef, setTriggerRef] = createSignal();
    const [contentRef, setContentRef] = createSignal();
    const [currentPlacement, setCurrentPlacement] = createSignal(others.placement);
    const disclosureState = createDisclosureState({
        open: () => local.open,
        defaultOpen: () => local.defaultOpen,
        onOpenChange: isOpen => local.onOpenChange?.(isOpen),
    });
    const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());
    const ensureTooltipEntry = () => {
        tooltips[tooltipId] = hideTooltip;
    };
    const closeOpenTooltips = () => {
        for (const hideTooltipId in tooltips) {
            if (hideTooltipId !== tooltipId) {
                tooltips[hideTooltipId](true);
                delete tooltips[hideTooltipId];
            }
        }
    };
    const hideTooltip = (immediate = false) => {
        if (isServer) {
            return;
        }
        if (immediate || (local.closeDelay && local.closeDelay <= 0)) {
            window.clearTimeout(closeTimeoutId);
            closeTimeoutId = undefined;
            disclosureState.close();
        }
        else if (!closeTimeoutId) {
            closeTimeoutId = window.setTimeout(() => {
                closeTimeoutId = undefined;
                disclosureState.close();
            }, local.closeDelay);
        }
        window.clearTimeout(globalWarmUpTimeout);
        globalWarmUpTimeout = undefined;
        if (globalWarmedUp) {
            window.clearTimeout(globalCoolDownTimeout);
            globalCoolDownTimeout = window.setTimeout(() => {
                delete tooltips[tooltipId];
                globalCoolDownTimeout = undefined;
                globalWarmedUp = false;
            }, local.closeDelay);
        }
    };
    const showTooltip = () => {
        if (isServer) {
            return;
        }
        clearTimeout(closeTimeoutId);
        closeTimeoutId = undefined;
        closeOpenTooltips();
        ensureTooltipEntry();
        globalWarmedUp = true;
        disclosureState.open();
        window.clearTimeout(globalWarmUpTimeout);
        globalWarmUpTimeout = undefined;
        window.clearTimeout(globalCoolDownTimeout);
        globalCoolDownTimeout = undefined;
    };
    const warmupTooltip = () => {
        if (isServer) {
            return;
        }
        closeOpenTooltips();
        ensureTooltipEntry();
        if (!disclosureState.isOpen() && !globalWarmUpTimeout && !globalWarmedUp) {
            globalWarmUpTimeout = window.setTimeout(() => {
                globalWarmUpTimeout = undefined;
                globalWarmedUp = true;
                showTooltip();
            }, local.openDelay);
        }
        else if (!disclosureState.isOpen()) {
            showTooltip();
        }
    };
    const openTooltip = (immediate = false) => {
        if (isServer) {
            return;
        }
        if (!immediate && local.openDelay && local.openDelay > 0 && !closeTimeoutId) {
            warmupTooltip();
        }
        else {
            showTooltip();
        }
    };
    const cancelOpening = () => {
        if (isServer) {
            return;
        }
        window.clearTimeout(globalWarmUpTimeout);
        globalWarmUpTimeout = undefined;
        globalWarmedUp = false;
    };
    const cancelClosing = () => {
        if (isServer) {
            return;
        }
        window.clearTimeout(closeTimeoutId);
        closeTimeoutId = undefined;
    };
    const isTargetOnTooltip = (target) => {
        return contains(triggerRef(), target) || contains(contentRef(), target);
    };
    const getPolygonSafeArea = (placement) => {
        const triggerEl = triggerRef();
        const contentEl = contentRef();
        if (!triggerEl || !contentEl) {
            return;
        }
        return getTooltipSafeArea(placement, triggerEl, contentEl);
    };
    const onHoverOutside = (event) => {
        const target = event.target;
        // Don't close if the mouse is moving through valid tooltip element.
        if (isTargetOnTooltip(target)) {
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
        // If there's already a scheduled timeout to hide the tooltip, we do nothing.
        if (closeTimeoutId) {
            return;
        }
        // Otherwise, hide the tooltip after the close delay.
        hideTooltip();
    };
    createEffect(() => {
        if (isServer) {
            return;
        }
        if (!disclosureState.isOpen()) {
            return;
        }
        const doc = getDocument();
        // Checks whether the mouse is moving outside the tooltip.
        // If yes, hide the tooltip after the close delay.
        doc.addEventListener("pointermove", onHoverOutside, true);
        onCleanup(() => {
            doc.removeEventListener("pointermove", onHoverOutside, true);
        });
    });
    // Close the tooltip if the trigger is scrolled.
    createEffect(() => {
        const trigger = triggerRef();
        if (!trigger || !disclosureState.isOpen()) {
            return;
        }
        const handleScroll = (event) => {
            const target = event.target;
            if (contains(target, trigger)) {
                hideTooltip(true);
            }
        };
        const win = getWindow();
        win.addEventListener("scroll", handleScroll, { capture: true });
        onCleanup(() => {
            win.removeEventListener("scroll", handleScroll, { capture: true });
        });
    });
    onCleanup(() => {
        clearTimeout(closeTimeoutId);
        const tooltip = tooltips[tooltipId];
        if (tooltip) {
            delete tooltips[tooltipId];
        }
    });
    const dataset = createMemo(() => ({
        "data-expanded": disclosureState.isOpen() ? "" : undefined,
        "data-closed": !disclosureState.isOpen() ? "" : undefined,
    }));
    const context = {
        dataset,
        isOpen: disclosureState.isOpen,
        isDisabled: () => local.disabled ?? false,
        triggerOnFocusOnly: () => local.triggerOnFocusOnly ?? false,
        contentId,
        contentPresence,
        openTooltip,
        hideTooltip,
        cancelOpening,
        generateId: createGenerateId(() => props.id),
        registerContentId: createRegisterId(setContentId),
        isTargetOnTooltip,
        setTriggerRef,
        setContentRef,
    };
    return (<TooltipContext.Provider value={context}>
      <PopperRoot anchorRef={triggerRef} contentRef={contentRef} onCurrentPlacementChange={setCurrentPlacement} {...others}/>
    </TooltipContext.Provider>);
}
