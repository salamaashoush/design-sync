/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/context.tsx
 */
import { createContext, useContext } from "solid-js";
import { createDefaultLocale } from "./create-default-locale";
import { getReadingDirection } from "./utils";
const I18nContext = createContext();
/**
 * Provides the locale for the application to all child components.
 */
export function I18nProvider(props) {
    const defaultLocale = createDefaultLocale();
    const context = {
        locale: () => props.locale ?? defaultLocale.locale(),
        direction: () => (props.locale ? getReadingDirection(props.locale) : defaultLocale.direction()),
    };
    return <I18nContext.Provider value={context}>{props.children}</I18nContext.Provider>;
}
/**
 * Returns an accessor for the current locale and layout direction.
 */
export function useLocale() {
    const defaultLocale = createDefaultLocale();
    const context = useContext(I18nContext);
    return context || defaultLocale;
}
