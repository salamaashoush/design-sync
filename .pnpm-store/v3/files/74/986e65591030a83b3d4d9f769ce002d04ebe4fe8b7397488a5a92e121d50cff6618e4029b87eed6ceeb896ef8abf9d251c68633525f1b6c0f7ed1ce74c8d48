/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard.tsx
 */
import { ParentProps } from "solid-js";
import { PopperRootOptions } from "../popper";
export interface HoverCardRootOptions extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> {
    /** The controlled open state of the hovercard. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /** Event handler called when the open state of the hovercard changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** The duration from when the mouse enters the trigger until the hovercard opens. */
    openDelay?: number;
    /** The duration from when the mouse leaves the trigger or content until the hovercard closes. */
    closeDelay?: number;
    /** Whether to close the hovercard even if the user cursor is inside the safe area between the trigger and hovercard. */
    ignoreSafeArea?: boolean;
    /**
     * Used to force mounting the hovercard (portal and content) when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
}
export interface HoverCardRootProps extends ParentProps<HoverCardRootOptions> {
}
/**
 * A popover that allows sighted users to preview content available behind a link.
 */
export declare function HoverCardRoot(props: HoverCardRootProps): import("solid-js").JSX.Element;
