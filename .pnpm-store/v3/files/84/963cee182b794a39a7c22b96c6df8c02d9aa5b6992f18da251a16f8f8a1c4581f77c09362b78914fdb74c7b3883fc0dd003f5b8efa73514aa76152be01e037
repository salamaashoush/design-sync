import { ParentProps } from "solid-js";
export interface DialogRootOptions {
    /** The controlled open state of the dialog. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /** Event handler called when the open state of the dialog changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * Whether the dialog should be the only visible content for screen readers.
     * When set to `true`:
     * - interaction with outside elements will be disabled.
     * - scroll will be locked.
     * - focus will be locked inside the dialog content.
     * - elements outside the dialog content will not be visible for screen readers.
     */
    modal?: boolean;
    /** Whether the scroll should be locked even if the dialog is not modal. */
    preventScroll?: boolean;
    /**
     * Used to force mounting the dialog (portal, overlay and content) when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
}
export interface DialogRootProps extends ParentProps<DialogRootOptions> {
}
/**
 * A dialog is a window overlaid on either the primary window or another dialog window.
 */
export declare function DialogRoot(props: DialogRootProps): import("solid-js").JSX.Element;
