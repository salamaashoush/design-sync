import { isObject } from "@design-sync/utils";
import { normalizeColorValue } from "../../../normalize/color";
import type { ColorTokenModifier, DesignToken, WithExtension } from "../../../types";
import type {
  ExtensionContext,
  ProcessedToken,
  ProcessorExtension,
  TokenAction,
  TokenFilter,
  UpdateTokenAction,
} from "../../types";

/**
 * Color token modifiers extension interface
 */
export interface ColorTokenModifiersExtension {
  modifiers: ColorTokenModifier[];
}

/**
 * Check if a token has color modifiers extension
 */
export function hasColorTokenModifiersExtension(
  value: unknown,
): value is WithExtension<ColorTokenModifiersExtension> {
  if (!isObject(value)) return false;
  const token = value as DesignToken;
  if (!token.$extensions || !isObject(token.$extensions)) return false;
  return (
    "modifiers" in token.$extensions &&
    Array.isArray(token.$extensions.modifiers) &&
    token.$extensions.modifiers.length > 0
  );
}

/**
 * Options for color modifiers extension
 */
export interface ColorModifiersExtensionOptions {
  filter?: TokenFilter;
}

const DEFAULT_FILTER: TokenFilter = { type: "color" };

/**
 * Create a color modifiers extension
 *
 * This extension applies color modifiers (lighten, darken, saturate, etc.)
 * to color tokens that have the modifiers extension defined.
 */
export function colorModifiersExtension(
  options: ColorModifiersExtensionOptions = {},
): ProcessorExtension {
  const { filter = DEFAULT_FILTER } = options;

  return {
    name: "color-modifiers",
    filter,
    priority: 10, // Run early to apply modifiers before other extensions

    onToken(token: ProcessedToken, context: ExtensionContext): TokenAction[] | void {
      // Check if token has modifiers
      if (!hasColorTokenModifiersExtension(token.raw)) {
        return;
      }

      const modifiers = token.raw.$extensions.modifiers;
      const newModeValues: Record<string, unknown> = {};

      // Apply modifiers to each mode value
      for (const [mode, value] of Object.entries(token.modeValues)) {
        try {
          const normalized = normalizeColorValue(value, modifiers);
          newModeValues[mode] = normalized;
        } catch (error) {
          context.logger.warn(`Failed to apply modifiers to mode "${mode}": ${error}`, token.path);
          newModeValues[mode] = value;
        }
      }

      const updateAction: UpdateTokenAction = {
        type: "update",
        path: token.path,
        modeValues: newModeValues,
      };

      return [updateAction];
    },
  };
}
