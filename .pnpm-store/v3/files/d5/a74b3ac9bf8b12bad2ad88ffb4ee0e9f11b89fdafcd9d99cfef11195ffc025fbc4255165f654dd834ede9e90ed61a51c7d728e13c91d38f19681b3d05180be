/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/color-mode-context.ts
 */
import { ColorModeContextType } from "./types";
export declare const ColorModeContext: import("solid-js").Context<ColorModeContextType>;
/**
 * Primitive that reads from `ColorModeProvider` context,
 * Returns the color mode and function to toggle it.
 */
export declare function useColorMode(): ColorModeContextType;
/**
 * Change value based on color mode.
 *
 * @param light the light mode value
 * @param dark the dark mode value
 * @return A memoized value based on the color mode.
 *
 * @example
 *
 * ```js
 * const Icon = useColorModeValue(MoonIcon, SunIcon)
 * ```
 */
export declare function useColorModeValue<TLight = unknown, TDark = unknown>(light: TLight, dark: TDark): import("solid-js").Accessor<TLight | TDark>;
