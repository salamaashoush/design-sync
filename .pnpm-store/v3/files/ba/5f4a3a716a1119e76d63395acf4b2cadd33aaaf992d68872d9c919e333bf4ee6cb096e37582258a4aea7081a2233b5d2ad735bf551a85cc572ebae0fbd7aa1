/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-stately/tabs/src/useTabListState.ts
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTabList.ts
 */
import { Orientation, OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
import { TabsActivationMode } from "./types";
export interface TabsRootOptions extends AsChildProp {
    /** The controlled value of the tab to activate. */
    value?: string;
    /**
     * The value of the tab that should be active when initially rendered.
     * Useful when you do not need to control the state.
     */
    defaultValue?: string;
    /** Event handler called when the value changes. */
    onChange?: (value: string) => void;
    /** The orientation of the tabs. */
    orientation?: Orientation;
    /** Whether tabs are activated automatically on focus or manually. */
    activationMode?: TabsActivationMode;
    /** Whether the tabs are disabled. */
    disabled?: boolean;
}
export interface TabsRootProps extends OverrideComponentProps<"div", TabsRootOptions> {
}
/**
 * A set of layered sections of content, known as tab panels, that display one panel of content at a time.
 * `Tabs` contains all the parts of a tabs component and provide context for its children.
 */
export declare function TabsRoot(props: TabsRootProps): import("solid-js").JSX.Element;
