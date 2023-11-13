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
import { MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";
type EventDetails<T> = {
    originalEvent: T;
    isContextMenu: boolean;
};
export type PointerDownOutsideEvent = CustomEvent<EventDetails<PointerEvent>>;
export type FocusOutsideEvent = CustomEvent<EventDetails<FocusEvent>>;
export type InteractOutsideEvent = PointerDownOutsideEvent | FocusOutsideEvent;
export interface CreateInteractOutsideProps {
    /** Whether the interact outside events should be listened or not. */
    isDisabled?: MaybeAccessor<boolean | undefined>;
    /**
     * When user interacts with the argument element outside the ref,
     * return `true` if the interaction should not trigger the "interact outside" handlers.
     */
    shouldExcludeElement?: (element: HTMLElement) => boolean;
    /**
     * Event handler called when a `pointerdown` event happens outside the ref.
     * Can be prevented.
     */
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
    /**
     * Event handler called when the focus moves outside the ref.
     * Can be prevented.
     */
    onFocusOutside?: (event: FocusOutsideEvent) => void;
    /**
     * Event handler called when an interaction happens outside the ref.
     * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
     * Can be prevented.
     */
    onInteractOutside?: (event: InteractOutsideEvent) => void;
}
export declare function createInteractOutside<T extends HTMLElement>(props: CreateInteractOutsideProps, ref: Accessor<T | undefined>): void;
export {};
