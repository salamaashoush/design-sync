import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
import { FocusOutsideEvent, InteractOutsideEvent, PointerDownOutsideEvent } from "../primitives";
export interface SelectContentOptions extends AsChildProp {
    /**
     * Event handler called when focus moves to the trigger after closing.
     * It can be prevented by calling `event.preventDefault`.
     */
    onCloseAutoFocus?: (event: Event) => void;
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
    /** The HTML styles attribute (object form only). */
    style?: JSX.CSSProperties;
}
export interface SelectContentProps extends OverrideComponentProps<"div", SelectContentOptions> {
}
/**
 * The component that pops out when the select is open.
 */
export declare function SelectContent(props: SelectContentProps): JSX.Element;
