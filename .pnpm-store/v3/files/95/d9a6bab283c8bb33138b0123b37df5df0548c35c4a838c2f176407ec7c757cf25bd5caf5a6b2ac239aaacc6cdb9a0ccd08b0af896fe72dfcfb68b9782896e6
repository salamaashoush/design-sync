/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/interact-outside/src/index.ts
 */
import { access, composeEventHandlers, contains, getDocument, isCtrlKey, noop, } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import { DATA_TOP_LAYER_ATTR } from "../../dismissable-layer/layer-stack";
const POINTER_DOWN_OUTSIDE_EVENT = "interactOutside.pointerDownOutside";
const FOCUS_OUTSIDE_EVENT = "interactOutside.focusOutside";
export function createInteractOutside(props, ref) {
    let pointerDownTimeoutId;
    let clickHandler = noop;
    const ownerDocument = () => getDocument(ref());
    const onPointerDownOutside = (e) => props.onPointerDownOutside?.(e);
    const onFocusOutside = (e) => props.onFocusOutside?.(e);
    const onInteractOutside = (e) => props.onInteractOutside?.(e);
    const isEventOutside = (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) {
            return false;
        }
        // If the target is within a top layer element (e.g. toasts), ignore.
        if (target.closest(`[${DATA_TOP_LAYER_ATTR}]`)) {
            return false;
        }
        if (!contains(ownerDocument(), target)) {
            return false;
        }
        if (contains(ref(), target)) {
            return false;
        }
        return !props.shouldExcludeElement?.(target);
    };
    const onPointerDown = (e) => {
        function handler() {
            const container = ref();
            const target = e.target;
            if (!container || !target || !isEventOutside(e)) {
                return;
            }
            const handler = composeEventHandlers([
                onPointerDownOutside,
                onInteractOutside,
            ]);
            target.addEventListener(POINTER_DOWN_OUTSIDE_EVENT, handler, { once: true });
            const pointerDownOutsideEvent = new CustomEvent(POINTER_DOWN_OUTSIDE_EVENT, {
                bubbles: false,
                cancelable: true,
                detail: {
                    originalEvent: e,
                    isContextMenu: e.button === 2 || (isCtrlKey(e) && e.button === 0),
                },
            });
            target.dispatchEvent(pointerDownOutsideEvent);
        }
        /**
         * On touch devices, we need to wait for a click event because browsers implement
         * a ~350ms delay between the time the user stops touching the display and when the
         * browser executes events. We need to ensure we don't reactivate pointer-events within
         * this timeframe otherwise the browser may execute events that should have been prevented.
         *
         * Additionally, this also lets us deal automatically with cancellations when a click event
         * isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
         *
         * This is why we also continuously remove the previous listener, because we cannot be
         * certain that it was raised, and therefore cleaned-up.
         */
        if (e.pointerType === "touch") {
            ownerDocument().removeEventListener("click", handler);
            clickHandler = handler;
            ownerDocument().addEventListener("click", handler, { once: true });
        }
        else {
            handler();
        }
    };
    const onFocusIn = (e) => {
        const container = ref();
        const target = e.target;
        if (!container || !target || !isEventOutside(e)) {
            return;
        }
        const handler = composeEventHandlers([onFocusOutside, onInteractOutside]);
        target.addEventListener(FOCUS_OUTSIDE_EVENT, handler, { once: true });
        const focusOutsideEvent = new CustomEvent(FOCUS_OUTSIDE_EVENT, {
            bubbles: false,
            cancelable: true,
            detail: {
                originalEvent: e,
                isContextMenu: false,
            },
        });
        target.dispatchEvent(focusOutsideEvent);
    };
    createEffect(() => {
        if (isServer) {
            return;
        }
        if (access(props.isDisabled)) {
            return;
        }
        /**
         * if this primitive executes in a component that mounts via a `pointerdown` event, the event
         * would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
         * this by delaying the event listener registration on the document.
         * ```
         * button.addEventListener('pointerdown', () => {
         *   console.log('I will log');
         *   document.addEventListener('pointerdown', () => {
         *     console.log('I will also log');
         *   })
         * });
         */
        pointerDownTimeoutId = window.setTimeout(() => {
            ownerDocument().addEventListener("pointerdown", onPointerDown, true);
        }, 0);
        ownerDocument().addEventListener("focusin", onFocusIn, true);
        onCleanup(() => {
            window.clearTimeout(pointerDownTimeoutId);
            ownerDocument().removeEventListener("click", clickHandler);
            ownerDocument().removeEventListener("pointerdown", onPointerDown, true);
            ownerDocument().removeEventListener("focusin", onFocusIn, true);
        });
    });
}
