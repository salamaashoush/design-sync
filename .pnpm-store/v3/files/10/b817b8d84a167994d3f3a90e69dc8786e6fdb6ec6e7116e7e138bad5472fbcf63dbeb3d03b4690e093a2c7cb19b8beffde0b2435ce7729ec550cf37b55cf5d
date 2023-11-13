/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/popover/popover-state.ts
 */
import { Accessor, ParentProps } from "solid-js";
import { PopperRootOptions } from "../popper";
export interface PopoverRootOptions extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> {
    /**
     * A ref for the anchor element.
     * Useful if you want to use an element outside `Popover` as the popover anchor.
     */
    anchorRef?: Accessor<HTMLElement | undefined>;
    /** The controlled open state of the popover. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /** Event handler called when the open state of the popover changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * Whether the popover should be the only visible content for screen readers.
     * When set to `true`:
     * - interaction with outside elements will be disabled.
     * - scroll will be locked.
     * - focus will be locked inside the popover content.
     * - elements outside the popover content will not be visible for screen readers.
     */
    modal?: boolean;
    /** Whether the scroll should be locked even if the popover is not modal. */
    preventScroll?: boolean;
    /**
     * Used to force mounting the popover (portal, positioner and content) when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
}
export interface PopoverRootProps extends ParentProps<PopoverRootOptions> {
}
/**
 * A popover is a dialog positioned relative to an anchor element.
 */
export declare function PopoverRoot(props: PopoverRootProps): import("solid-js").JSX.Element;
