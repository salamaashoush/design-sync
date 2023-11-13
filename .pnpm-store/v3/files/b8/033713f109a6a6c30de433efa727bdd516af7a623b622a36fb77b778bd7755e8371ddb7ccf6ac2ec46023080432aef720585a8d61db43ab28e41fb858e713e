/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useDefaultLocale.ts
 */
import { Direction } from "./utils";
interface Locale {
    /** The [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code for the locale. */
    locale: string;
    /** The writing direction for the locale. */
    direction: Direction;
}
/**
 * Gets the locale setting of the browser.
 */
export declare function getDefaultLocale(): Locale;
/**
 * Returns an accessor for the current browser/system language, and updates when it changes.
 */
export declare function createDefaultLocale(): {
    locale: () => string;
    direction: () => Direction;
};
export {};
