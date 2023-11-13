/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/context.tsx
 */
import { JSX } from "solid-js";
import { Direction } from "./utils";
interface I18nProviderProps {
    /** Contents that should have the locale applied. */
    children?: JSX.Element;
    /** The locale to apply to the children. */
    locale?: string;
}
/**
 * Provides the locale for the application to all child components.
 */
export declare function I18nProvider(props: I18nProviderProps): JSX.Element;
/**
 * Returns an accessor for the current locale and layout direction.
 */
export declare function useLocale(): {
    locale: () => string;
    direction: () => Direction;
};
export {};
