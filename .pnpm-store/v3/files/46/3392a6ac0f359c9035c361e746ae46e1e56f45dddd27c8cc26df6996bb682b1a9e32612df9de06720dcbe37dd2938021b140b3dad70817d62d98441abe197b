/*!
 * Portions of this file are based on code from floating-ui.
 * MIT Licensed, Copyright (c) 2021 Floating UI contributors.
 *
 * Credits to the Floating UI contributors:
 * https://github.com/floating-ui/floating-ui/blob/f7ce9420aa32c150eb45049f12cf3b5506715341/packages/react/src/components/FloatingOverlay.tsx
 *
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/5d8a1f047fcadcf117073c70359663a3946b73bf/packages/ariakit/src/dialog/__utils/use-prevent-body-scroll.ts
 */
import { MaybeAccessor } from "@kobalte/utils";
export interface PreventScrollProps {
    /** The element that requested a scroll lock. */
    ownerRef: MaybeAccessor<HTMLElement | undefined>;
    /** Whether the scroll lock is disabled. */
    isDisabled?: MaybeAccessor<boolean | undefined>;
}
/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export declare function createPreventScroll(props: PreventScrollProps): void;
