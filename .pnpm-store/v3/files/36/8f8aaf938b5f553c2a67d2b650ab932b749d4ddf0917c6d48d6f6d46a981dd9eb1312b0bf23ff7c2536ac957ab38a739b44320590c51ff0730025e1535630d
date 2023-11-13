/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp } from "../polymorphic";
export interface AccordionRootOptions extends AsChildProp {
    /** The controlled value of the accordion item(s) to expand. */
    value?: string[];
    /**
     * The value of the accordion item(s) to expand when initially rendered.
     * Useful when you do not need to control the state.
     */
    defaultValue?: string[];
    /** Event handler called when the value changes. */
    onChange?: (value: string[]) => void;
    /** Whether multiple items can be opened at the same time. */
    multiple?: boolean;
    /** When `multiple` is `false`, allows closing content when clicking trigger for an open item. */
    collapsible?: boolean;
    /** Whether focus should wrap around when the end/start is reached. */
    shouldFocusWrap?: boolean;
}
export interface AccordionRootProps extends OverrideComponentProps<"div", AccordionRootOptions> {
}
/**
 * A vertically stacked set of interactive headings that each reveal an associated section of content.
 */
export declare function AccordionRoot(props: AccordionRootProps): import("solid-js").JSX.Element;
