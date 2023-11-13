/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/tooltip/tooltip.tsx
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e67d48d4935b772f915b08f1d695d2ebafb876f0/packages/@react-stately/tooltip/src/useTooltipTriggerState.ts
 */
import { ParentProps } from "solid-js";
import { PopperRootOptions } from "../popper";
export interface TooltipRootOptions extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> {
    /** The controlled open state of the tooltip. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /** Event handler called when the open state of the tooltip changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** Whether the tooltip should be disabled, independent of the trigger. */
    disabled?: boolean;
    /**
     * Whether to open the tooltip only when the trigger is focused.
     * By default, opens for both focus and hover.
     */
    triggerOnFocusOnly?: boolean;
    /** The duration from when the mouse enters the trigger until the tooltip opens. */
    openDelay?: number;
    /** The duration from when the mouse leaves the trigger or content until the tooltip closes. */
    closeDelay?: number;
    /** Whether to close the tooltip even if the user cursor is inside the safe area between the trigger and tooltip. */
    ignoreSafeArea?: boolean;
    /**
     * Used to force mounting the tooltip (portal and content) when more control is needed.
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
export interface TooltipRootProps extends ParentProps<TooltipRootOptions> {
}
/**
 * A popup that displays information related to an element
 * when the element receives keyboard focus or the mouse hovers over it.
 */
export declare function TooltipRoot(props: TooltipRootProps): import("solid-js").JSX.Element;
