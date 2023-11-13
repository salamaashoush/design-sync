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
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/dismissable-layer.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { Accessor } from "solid-js";
import { AsChildProp } from "../polymorphic";
import { FocusOutsideEvent, InteractOutsideEvent, PointerDownOutsideEvent } from "../primitives";
export interface DismissableLayerOptions extends AsChildProp {
    /**
     * When `true`, hover/focus/click interactions will be disabled on elements outside
     * the layer. Users will need to click twice on outside elements to
     * interact with them: once to close the layer, and again to trigger the element.
     */
    disableOutsidePointerEvents?: boolean;
    /** A list of elements that should not dismiss the layer when interacted with. */
    excludedElements?: Array<Accessor<HTMLElement | undefined>>;
    /**
     * Event handler called when the escape key is down.
     * Can be prevented.
     */
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    /**
     * Event handler called when a `pointerdown` event happens outside the layer.
     * Can be prevented.
     */
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
    /**
     * Event handler called when the focus moves outside the layer.
     * Can be prevented.
     */
    onFocusOutside?: (event: FocusOutsideEvent) => void;
    /**
     * Event handler called when an interaction happens outside the layer.
     * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
     * Can be prevented.
     */
    onInteractOutside?: (event: InteractOutsideEvent) => void;
    /** Handler called when the layer should be dismissed. */
    onDismiss?: () => void;
    /** Whether to ignore the "top most layer" check on interact outside. */
    bypassTopMostLayerCheck?: boolean;
}
export interface DismissableLayerProps extends OverrideComponentProps<"div", DismissableLayerOptions> {
}
export declare function DismissableLayer(props: DismissableLayerProps): import("solid-js").JSX.Element;
