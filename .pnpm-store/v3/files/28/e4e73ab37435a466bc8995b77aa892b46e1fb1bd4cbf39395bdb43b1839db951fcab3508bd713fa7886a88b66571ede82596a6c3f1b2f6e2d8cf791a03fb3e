/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/1b05a8e35cf35f3020484979086d70aefbaf4095/packages/react/tooltip/src/Tooltip.tsx
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
import { PointerDownOutsideEvent } from "../primitives";
export interface TooltipContentOptions extends AsChildProp {
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
    /** The HTML styles attribute (object form only). */
    style?: JSX.CSSProperties;
}
export interface TooltipContentProps extends OverrideComponentProps<"div", TooltipContentOptions> {
}
/**
 * Contains the content to be rendered when the tooltip is open.
 */
export declare function TooltipContent(props: TooltipContentProps): JSX.Element;
