import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
import { FocusOutsideEvent, InteractOutsideEvent, PointerDownOutsideEvent } from "../primitives";
export interface DatePickerContentOptions extends AsChildProp {
    /** The HTML styles attribute (object form only). */
    style?: JSX.CSSProperties;
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
export interface DatePickerContentProps extends OverrideComponentProps<"div", DatePickerContentOptions> {
}
/**
 * The component that pops out when the date picker is open.
 */
export declare function DatePickerContent(props: DatePickerContentProps): JSX.Element;
