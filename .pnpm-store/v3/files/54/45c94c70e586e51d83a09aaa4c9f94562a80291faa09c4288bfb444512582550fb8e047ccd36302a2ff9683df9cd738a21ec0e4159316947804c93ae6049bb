/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
export interface MenuRadioGroupOptions extends AsChildProp {
    /** The controlled value of the item radio to check. */
    value?: string;
    /**
     * The value of the item radio that should be checked when initially rendered.
     * Useful when you do not need to control the state of the menu radio group.
     */
    defaultValue?: string;
    /** Event handler called when the value changes. */
    onChange?: (value: string) => void;
    /** Whether the menu radio group is disabled. */
    disabled?: boolean;
}
export interface MenuRadioGroupProps extends OverrideComponentProps<"div", MenuRadioGroupOptions> {
}
/**
 * A container used to group multiple `Menu.RadioItem`s and manage the selection.
 */
export declare function MenuRadioGroup(props: MenuRadioGroupProps): import("solid-js").JSX.Element;
