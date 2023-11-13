/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dialog/src/Dialog.tsx
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
import { FocusOutsideEvent, InteractOutsideEvent, PointerDownOutsideEvent } from "../primitives";
export interface DialogContentOptions extends AsChildProp {
    /**
     * Event handler called when focus moves into the component after opening.
     * It can be prevented by calling `event.preventDefault`.
     */
    onOpenAutoFocus?: (event: Event) => void;
    /**
     * Event handler called when focus moves to the trigger after closing.
     * It can be prevented by calling `event.preventDefault`.
     */
    onCloseAutoFocus?: (event: Event) => void;
    /**
     * Event handler called when the escape key is down.
     * It can be prevented by calling `event.preventDefault`.
     */
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    /**
     * Event handler called when a pointer event occurs outside the bounds of the component.
     * It can be prevented by calling `event.preventDefault`.
     */
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
    /**
     * Event handler called when the focus moves outside the bounds of the component.
     * It can be prevented by calling `event.preventDefault`.
     */
    onFocusOutside?: (event: FocusOutsideEvent) => void;
    /**
     * Event handler called when an interaction (pointer or focus event) happens outside the bounds of the component.
     * It can be prevented by calling `event.preventDefault`.
     */
    onInteractOutside?: (event: InteractOutsideEvent) => void;
}
export interface DialogContentProps extends OverrideComponentProps<"div", DialogContentOptions> {
}
/**
 * Contains the content to be rendered when the dialog is open.
 */
export declare function DialogContent(props: DialogContentProps): import("solid-js").JSX.Element;
