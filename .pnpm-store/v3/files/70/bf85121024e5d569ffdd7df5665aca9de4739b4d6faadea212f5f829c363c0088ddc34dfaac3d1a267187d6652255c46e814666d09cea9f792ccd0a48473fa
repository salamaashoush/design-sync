/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/23c3a91e7b87952f07da9da115188bd2abd99d77/packages/@react-aria/i18n/src/useMessageFormatter.ts
 */
import { LocalizedStrings } from "@internationalized/message";
import { MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";
export interface LocalizedMessageFormatter {
    format: (key: string, variables?: {
        [key: string]: any;
    }) => string;
}
/**
 * Handles formatting ICU Message strings to create localized strings for the current locale.
 * Automatically updates when the locale changes, and handles caching of messages for performance.
 * @param strings - A mapping of languages to strings by key.
 */
export declare function createMessageFormatter(strings: MaybeAccessor<LocalizedStrings>): Accessor<LocalizedMessageFormatter>;
