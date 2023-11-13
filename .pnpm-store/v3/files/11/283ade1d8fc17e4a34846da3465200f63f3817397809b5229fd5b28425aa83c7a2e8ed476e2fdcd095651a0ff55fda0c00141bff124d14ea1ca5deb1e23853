/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuSubTrigger.ts
 *
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
export interface MenuSubTriggerOptions extends AsChildProp {
    /**
     * Optional text used for typeahead purposes.
     * By default, the typeahead behavior will use the .textContent of the Menu.SubTrigger.
     * Use this when the content is complex, or you have non-textual content inside.
     */
    textValue?: string;
    /** Whether the sub menu trigger is disabled. */
    disabled?: boolean;
}
export interface MenuSubTriggerProps extends OverrideComponentProps<"div", MenuSubTriggerOptions> {
}
/**
 * An item that opens a submenu.
 */
export declare function MenuSubTrigger(props: MenuSubTriggerProps): JSX.Element;
