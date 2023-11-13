import { OverrideComponentProps } from "@kobalte/utils";
import { MenuItemBaseOptions } from "./menu-item-base";
export interface MenuCheckboxItemOptions extends Omit<MenuItemBaseOptions, "checked"> {
    /** The controlled checked state of the menu item checkbox. */
    checked?: boolean;
    /**
     * The default checked state when initially rendered.
     * Useful when you do not need to control the checked state.
     */
    defaultChecked?: boolean;
    /** Event handler called when the checked state of the menu item checkbox changes. */
    onChange?: (isChecked: boolean) => void;
}
export interface MenuCheckboxItemProps extends OverrideComponentProps<"div", MenuCheckboxItemOptions> {
}
/**
 * An item that can be controlled and rendered like a checkbox.
 */
export declare function MenuCheckboxItem(props: MenuCheckboxItemProps): import("solid-js").JSX.Element;
