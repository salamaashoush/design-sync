/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/tooltip/tooltip-anchor.ts
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e67d48d4935b772f915b08f1d695d2ebafb876f0/packages/@react-aria/tooltip/src/useTooltipTrigger.ts
 *
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/1b05a8e35cf35f3020484979086d70aefbaf4095/packages/react/tooltip/src/Tooltip.tsx
 */
import { callHandler, getDocument, mergeRefs } from "@kobalte/utils";
import { onCleanup, splitProps } from "solid-js";
import { isServer } from "solid-js/web";
import { Polymorphic } from "../polymorphic";
import { useTooltipContext } from "./tooltip-context";
/**
 * The button that opens the tooltip when hovered.
 */
export function TooltipTrigger(props) {
    let ref;
    const context = useTooltipContext();
    const [local, others] = splitProps(props, [
        "ref",
        "onPointerEnter",
        "onPointerLeave",
        "onPointerDown",
        "onClick",
        "onFocus",
        "onBlur",
        "onTouchStart",
    ]);
    let isPointerDown = false;
    let isHovered = false;
    let isFocused = false;
    const handlePointerUp = () => {
        isPointerDown = false;
    };
    const handleShow = () => {
        if (!context.isOpen() && (isHovered || isFocused)) {
            context.openTooltip(isFocused);
        }
    };
    const handleHide = (immediate) => {
        if (context.isOpen() && !isHovered && !isFocused) {
            context.hideTooltip(immediate);
        }
    };
    const onPointerEnter = e => {
        callHandler(e, local.onPointerEnter);
        if (e.pointerType === "touch" ||
            context.triggerOnFocusOnly() ||
            context.isDisabled() ||
            e.defaultPrevented) {
            return;
        }
        isHovered = true;
        handleShow();
    };
    const onPointerLeave = e => {
        callHandler(e, local.onPointerLeave);
        if (e.pointerType === "touch") {
            return;
        }
        // No matter how the trigger is left, we should close the tooltip.
        isHovered = false;
        isFocused = false;
        if (context.isOpen()) {
            handleHide();
        }
        else {
            context.cancelOpening();
        }
    };
    const onPointerDown = e => {
        callHandler(e, local.onPointerDown);
        isPointerDown = true;
        getDocument(ref).addEventListener("pointerup", handlePointerUp, { once: true });
    };
    const onClick = e => {
        callHandler(e, local.onClick);
        // No matter how the trigger is left, we should close the tooltip.
        isHovered = false;
        isFocused = false;
        handleHide(true);
    };
    const onFocus = e => {
        callHandler(e, local.onFocus);
        if (context.isDisabled() || e.defaultPrevented || isPointerDown) {
            return;
        }
        isFocused = true;
        handleShow();
    };
    const onBlur = e => {
        callHandler(e, local.onBlur);
        const relatedTarget = e.relatedTarget;
        if (context.isTargetOnTooltip(relatedTarget)) {
            return;
        }
        // No matter how the trigger is left, we should close the tooltip.
        isHovered = false;
        isFocused = false;
        handleHide(true);
    };
    onCleanup(() => {
        if (isServer) {
            return;
        }
        getDocument(ref).removeEventListener("pointerup", handlePointerUp);
    });
    // We purposefully avoid using Kobalte `Button` here because tooltip triggers can be any element
    // and should not always be announced as a button to screen readers.
    return (<Polymorphic as="button" ref={mergeRefs(el => {
            context.setTriggerRef(el);
            ref = el;
        }, local.ref)} aria-describedby={context.isOpen() ? context.contentId() : undefined} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} onPointerDown={onPointerDown} onClick={onClick} onFocus={onFocus} onBlur={onBlur} {...context.dataset()} {...others}/>);
}
