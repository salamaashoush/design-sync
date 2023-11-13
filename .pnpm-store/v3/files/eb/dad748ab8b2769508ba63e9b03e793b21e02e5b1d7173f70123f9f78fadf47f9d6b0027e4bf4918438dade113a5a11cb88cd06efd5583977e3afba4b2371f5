/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
export interface CollapsibleRootOptions extends AsChildProp {
    /** The controlled open state of the collapsible. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /** Event handler called when the open state of the collapsible changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** Whether the collapsible is disabled. */
    disabled?: boolean;
    /**
     * Used to force mounting the collapsible content when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
}
export interface CollapsibleRootProps extends OverrideComponentProps<"div", CollapsibleRootOptions> {
}
/**
 * An interactive component which expands/collapses a content.
 */
export declare function CollapsibleRoot(props: CollapsibleRootProps): import("solid-js").JSX.Element;
