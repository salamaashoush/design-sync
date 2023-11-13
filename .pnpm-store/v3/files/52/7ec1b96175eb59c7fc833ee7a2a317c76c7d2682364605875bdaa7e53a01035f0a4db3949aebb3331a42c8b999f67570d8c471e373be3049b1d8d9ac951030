/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTab.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
export interface TabsTriggerOptions extends AsChildProp {
    /** The unique key that associates the tab with a tab panel. */
    value: string;
    /** Whether the tab should be disabled. */
    disabled?: boolean;
}
export interface TabsTriggerProps extends OverrideComponentProps<"button", TabsTriggerOptions> {
}
/**
 * The button that activates its associated tab panel.
 */
export declare function TabsTrigger(props: TabsTriggerProps): JSX.Element;
