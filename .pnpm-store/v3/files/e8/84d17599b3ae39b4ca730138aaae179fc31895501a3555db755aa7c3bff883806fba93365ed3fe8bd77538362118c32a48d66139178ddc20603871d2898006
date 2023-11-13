/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
export interface MenuItemBaseOptions extends AsChildProp {
    /**
     * Optional text used for typeahead purposes.
     * By default, the typeahead behavior will use the .textContent of the Menu.ItemLabel part
     * if provided, or fallback to the .textContent of the Menu.Item.
     * Use this when the content is complex, or you have non-textual content inside.
     */
    textValue?: string;
    /** Whether the menu item is disabled. */
    disabled?: boolean;
    /** Whether the menu item is checked (item radio or item checkbox). */
    checked?: boolean;
    /**
     * When using menu item checkbox, whether the checked state is in an indeterminate mode.
     * Indeterminism is presentational only.
     * The indeterminate visual representation remains regardless of user interaction.
     */
    indeterminate?: boolean;
    /** Whether the menu should close when the menu item is activated/selected. */
    closeOnSelect?: boolean;
    /** Event handler called when the user selects an item (via mouse or keyboard). */
    onSelect?: () => void;
}
export interface MenuItemBaseProps extends OverrideComponentProps<"div", MenuItemBaseOptions> {
}
/**
 * Base component for a menu item.
 */
export declare function MenuItemBase(props: MenuItemBaseProps): JSX.Element;
