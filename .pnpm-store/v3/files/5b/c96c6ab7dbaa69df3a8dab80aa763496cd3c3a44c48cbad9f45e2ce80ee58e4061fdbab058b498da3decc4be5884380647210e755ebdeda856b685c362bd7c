/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 *
 * Portions of this file are based on code from sonner.
 * MIT Licensed, Copyright (c) 2023 Emil Kowalski.
 *
 * Credits to the sonner team:
 * https://github.com/emilkowalski/sonner/blob/0d027fd3a41013fada9d8a3ef807bcc87053bde8/src/index.tsx
 */
import { callHandler, createGenerateId, mergeDefaultProps, mergeRefs, } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, createUniqueId, on, onMount, Show, splitProps, } from "solid-js";
import { createPresence, createRegisterId } from "../primitives";
import { ToastContext } from "./toast-context";
import { useToastRegionContext } from "./toast-region-context";
import { toastStore } from "./toast-store";
const TOAST_SWIPE_START_EVENT = "toast.swipeStart";
const TOAST_SWIPE_MOVE_EVENT = "toast.swipeMove";
const TOAST_SWIPE_CANCEL_EVENT = "toast.swipeCancel";
const TOAST_SWIPE_END_EVENT = "toast.swipeEnd";
export function ToastRoot(props) {
    const defaultId = `toast-${createUniqueId()}`;
    const rootContext = useToastRegionContext();
    props = mergeDefaultProps({
        id: defaultId,
        priority: "high",
    }, props);
    const [local, others] = splitProps(props, [
        "ref",
        "toastId",
        "style",
        "priority",
        "duration",
        "persistent",
        "onPause",
        "onResume",
        "onSwipeStart",
        "onSwipeMove",
        "onSwipeCancel",
        "onSwipeEnd",
        "onEscapeKeyDown",
        "onKeyDown",
        "onPointerDown",
        "onPointerMove",
        "onPointerUp",
    ]);
    const [isOpen, setIsOpen] = createSignal(true);
    const [titleId, setTitleId] = createSignal();
    const [descriptionId, setDescriptionId] = createSignal();
    const [isAnimationEnabled, setIsAnimationEnabled] = createSignal(true);
    const presence = createPresence(isOpen);
    const duration = createMemo(() => local.duration || rootContext.duration());
    let closeTimerId;
    let closeTimerStartTime = 0;
    let closeTimerRemainingTime = duration();
    let pointerStart = null;
    let swipeDelta = null;
    const close = () => {
        setIsOpen(false);
        // Restore animation for the exit phase, which have been disabled if it's a toast update.
        setIsAnimationEnabled(true);
    };
    const deleteToast = () => {
        toastStore.remove(local.toastId);
    };
    const startTimer = (duration) => {
        if (!duration || local.persistent) {
            return;
        }
        window.clearTimeout(closeTimerId);
        closeTimerStartTime = new Date().getTime();
        closeTimerId = window.setTimeout(close, duration);
    };
    const resumeTimer = () => {
        startTimer(closeTimerRemainingTime);
        local.onResume?.();
    };
    const pauseTimer = () => {
        const elapsedTime = new Date().getTime() - closeTimerStartTime;
        closeTimerRemainingTime = closeTimerRemainingTime - elapsedTime;
        window.clearTimeout(closeTimerId);
        local.onPause?.();
    };
    const onKeyDown = e => {
        callHandler(e, local.onKeyDown);
        if (e.key !== "Escape") {
            return;
        }
        local.onEscapeKeyDown?.(e);
        if (!e.defaultPrevented) {
            close();
        }
    };
    const onPointerDown = e => {
        callHandler(e, local.onPointerDown);
        if (e.button !== 0) {
            return;
        }
        pointerStart = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = e => {
        callHandler(e, local.onPointerMove);
        if (!pointerStart) {
            return;
        }
        const x = e.clientX - pointerStart.x;
        const y = e.clientY - pointerStart.y;
        const hasSwipeMoveStarted = Boolean(swipeDelta);
        const isHorizontalSwipe = ["left", "right"].includes(rootContext.swipeDirection());
        const clamp = ["left", "up"].includes(rootContext.swipeDirection()) ? Math.min : Math.max;
        const clampedX = isHorizontalSwipe ? clamp(0, x) : 0;
        const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0;
        const moveStartBuffer = e.pointerType === "touch" ? 10 : 2;
        const delta = { x: clampedX, y: clampedY };
        const eventDetail = { originalEvent: e, delta };
        if (hasSwipeMoveStarted) {
            swipeDelta = delta;
            handleAndDispatchCustomEvent(TOAST_SWIPE_MOVE_EVENT, local.onSwipeMove, eventDetail);
            const { x, y } = delta;
            e.currentTarget.setAttribute("data-swipe", "move");
            e.currentTarget.style.setProperty("--kb-toast-swipe-move-x", `${x}px`);
            e.currentTarget.style.setProperty("--kb-toast-swipe-move-y", `${y}px`);
        }
        else if (isDeltaInDirection(delta, rootContext.swipeDirection(), moveStartBuffer)) {
            swipeDelta = delta;
            handleAndDispatchCustomEvent(TOAST_SWIPE_START_EVENT, local.onSwipeStart, eventDetail);
            e.currentTarget.setAttribute("data-swipe", "start");
            e.target.setPointerCapture(e.pointerId);
        }
        else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
            // User is swiping in wrong direction, so we disable swipe gesture
            // for the current pointer down interaction
            pointerStart = null;
        }
    };
    const onPointerUp = e => {
        callHandler(e, local.onPointerUp);
        const delta = swipeDelta;
        const target = e.target;
        if (target.hasPointerCapture(e.pointerId)) {
            target.releasePointerCapture(e.pointerId);
        }
        swipeDelta = null;
        pointerStart = null;
        if (delta) {
            const toast = e.currentTarget;
            const eventDetail = { originalEvent: e, delta };
            if (isDeltaInDirection(delta, rootContext.swipeDirection(), rootContext.swipeThreshold())) {
                handleAndDispatchCustomEvent(TOAST_SWIPE_END_EVENT, local.onSwipeEnd, eventDetail);
                const { x, y } = delta;
                e.currentTarget.setAttribute("data-swipe", "end");
                e.currentTarget.style.removeProperty("--kb-toast-swipe-move-x");
                e.currentTarget.style.removeProperty("--kb-toast-swipe-move-y");
                e.currentTarget.style.setProperty("--kb-toast-swipe-end-x", `${x}px`);
                e.currentTarget.style.setProperty("--kb-toast-swipe-end-y", `${y}px`);
                close();
            }
            else {
                handleAndDispatchCustomEvent(TOAST_SWIPE_CANCEL_EVENT, local.onSwipeCancel, eventDetail);
                e.currentTarget.setAttribute("data-swipe", "cancel");
                e.currentTarget.style.removeProperty("--kb-toast-swipe-move-x");
                e.currentTarget.style.removeProperty("--kb-toast-swipe-move-y");
                e.currentTarget.style.removeProperty("--kb-toast-swipe-end-x");
                e.currentTarget.style.removeProperty("--kb-toast-swipe-end-y");
            }
            // Prevent click event from triggering on items within the toast when
            // pointer up is part of a swipe gesture
            toast.addEventListener("click", event => event.preventDefault(), {
                once: true,
            });
        }
    };
    onMount(() => {
        // Disable animation for updated toast.
        if (rootContext.toasts().find(toast => toast.id === local.toastId && toast.update)) {
            setIsAnimationEnabled(false);
        }
    });
    createEffect(on(() => rootContext.isPaused(), isPaused => {
        if (isPaused) {
            pauseTimer();
        }
        else {
            resumeTimer();
        }
    }, {
        defer: true,
    }));
    // start timer when toast opens or duration changes.
    // we include `open` in deps because closed !== unmounted when animating,
    // so it could reopen before being completely unmounted
    createEffect(on([isOpen, duration], ([isOpen, duration]) => {
        if (isOpen && !rootContext.isPaused()) {
            startTimer(duration);
        }
    }));
    createEffect(on(() => toastStore.get(local.toastId)?.dismiss, dismiss => dismiss && close()));
    createEffect(on(() => presence.isPresent(), isPresent => !isPresent && deleteToast()));
    const context = {
        close,
        duration,
        isPersistent: () => local.persistent ?? false,
        closeTimerStartTime: () => closeTimerStartTime,
        generateId: createGenerateId(() => others.id),
        registerTitleId: createRegisterId(setTitleId),
        registerDescriptionId: createRegisterId(setDescriptionId),
    };
    return (<Show when={presence.isPresent()}>
      <ToastContext.Provider value={context}>
        <li ref={mergeRefs(presence.setRef, local.ref)} role="status" tabIndex={0} style={{
            animation: isAnimationEnabled() ? undefined : "none",
            "user-select": "none",
            "touch-action": "none",
            ...local.style,
        }} aria-live={local.priority === "high" ? "assertive" : "polite"} aria-atomic="true" aria-labelledby={titleId()} aria-describedby={descriptionId()} data-opened={isOpen() ? "" : undefined} data-closed={!isOpen() ? "" : undefined} data-swipe-direction={rootContext.swipeDirection()} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} {...others}/>
      </ToastContext.Provider>
    </Show>);
}
function isDeltaInDirection(delta, direction, threshold = 0) {
    const deltaX = Math.abs(delta.x);
    const deltaY = Math.abs(delta.y);
    const isDeltaX = deltaX > deltaY;
    if (direction === "left" || direction === "right") {
        return isDeltaX && deltaX > threshold;
    }
    else {
        return !isDeltaX && deltaY > threshold;
    }
}
function handleAndDispatchCustomEvent(name, handler, detail) {
    const currentTarget = detail.originalEvent.currentTarget;
    const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail });
    if (handler) {
        currentTarget.addEventListener(name, handler, { once: true });
    }
    currentTarget.dispatchEvent(event);
}
