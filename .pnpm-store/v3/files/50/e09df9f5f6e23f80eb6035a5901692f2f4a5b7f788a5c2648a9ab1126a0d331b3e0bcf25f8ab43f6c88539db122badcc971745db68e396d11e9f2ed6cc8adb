/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */
import { ParentProps } from "solid-js";
import { PopperRootOptions } from "../popper";
export interface MenuOptions extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> {
    /** The controlled open state of the menu. */
    open?: boolean;
    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;
    /** Event handler called when the open state of the menu changes. */
    onOpenChange?: (isOpen: boolean) => void;
}
export interface MenuProps extends ParentProps<MenuOptions> {
}
/**
 * Container for menu items and nested menu, provide context for its children.
 */
export declare function Menu(props: MenuProps): import("solid-js").JSX.Element;
