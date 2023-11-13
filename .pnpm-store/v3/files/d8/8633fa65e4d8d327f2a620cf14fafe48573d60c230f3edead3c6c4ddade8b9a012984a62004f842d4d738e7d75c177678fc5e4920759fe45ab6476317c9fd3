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
import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
export type SwipeEvent = {
    currentTarget: EventTarget & HTMLLIElement;
} & Omit<CustomEvent<{
    originalEvent: PointerEvent;
    delta: {
        x: number;
        y: number;
    };
}>, "currentTarget">;
export interface ToastRootOptions {
    /** The id of the toast provided by the `toaster`. */
    toastId: number;
    /**
     * Control the sensitivity of the toast for accessibility purposes.
     * For toasts that are the result of a user action, choose `high`.
     * Toasts generated from background tasks should use `low`.
     */
    priority?: "high" | "low";
    /**
     * The time in milliseconds that should elapse before automatically closing the toast.
     * This will override the value supplied to `Toast.Region`.
     */
    duration?: number;
    /** Whether the toast should ignore duration and disappear only by a user action. */
    persistent?: boolean;
    /**
     * Event handler called when the dismiss timer is paused.
     * This occurs when the pointer is moved over the region or the region is focused.
     */
    onPause?: () => void;
    /**
     * Event handler called when the dismiss timer is resumed.
     * This occurs when the pointer is moved away from the region or the region is blurred.
     */
    onResume?: () => void;
    /** Event handler called when starting a swipe interaction. */
    onSwipeStart?: (event: SwipeEvent) => void;
    /** Event handler called during a swipe interaction. */
    onSwipeMove?: (event: SwipeEvent) => void;
    /** Event handler called when a swipe interaction is cancelled. */
    onSwipeCancel?: (event: SwipeEvent) => void;
    /** Event handler called at the end of a swipe interaction. */
    onSwipeEnd?: (event: SwipeEvent) => void;
    /**
     * Event handler called when the escape key is down.
     * It can be prevented by calling `event.preventDefault`.
     */
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    /** The HTML styles attribute (object form only). */
    style?: JSX.CSSProperties;
}
export type ToastRootProps = OverrideComponentProps<"li", ToastRootOptions>;
export declare function ToastRoot(props: ToastRootProps): JSX.Element;
