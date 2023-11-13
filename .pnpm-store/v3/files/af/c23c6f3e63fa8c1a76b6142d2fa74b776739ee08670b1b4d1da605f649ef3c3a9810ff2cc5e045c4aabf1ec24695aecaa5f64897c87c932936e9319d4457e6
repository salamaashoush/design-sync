/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTabPanel.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
export interface TabsContentOptions extends AsChildProp {
    /** The unique key that associates the tab panel with a tab. */
    value: string;
    /**
     * Used to force mounting when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
}
export interface TabsContentProps extends OverrideComponentProps<"div", TabsContentOptions> {
}
/**
 * Contains the content associated with a tab trigger.
 */
export declare function TabsContent(props: TabsContentProps): import("solid-js").JSX.Element;
