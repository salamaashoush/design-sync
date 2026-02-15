import { isObject } from "@design-sync/utils";
import { normalizeColorValue } from "../../../normalize/color";
import type { Color, ColorModifier, DesignToken, WithExtension } from "../../../types";
import type { ProcessorExtension, SchemaExtensionContext, TokenFilter } from "../../types";

/**
 * Token generator definition
 */
export interface TokenGenerator {
  type: ColorModifier;
  value: Record<
    string,
    | number
    | {
        value: number;
        base: string;
      }
  >;
}

/**
 * Generators extension interface
 */
export interface TokenGeneratorsExtension {
  generators: TokenGenerator[];
}

/**
 * Check if a token has generators extension
 */
export function hasGeneratorsExtension(
  value: unknown,
): value is WithExtension<TokenGeneratorsExtension> {
  if (!isObject(value)) return false;
  const token = value as DesignToken;
  if (!token.$extensions || !isObject(token.$extensions)) return false;
  return (
    "generators" in token.$extensions &&
    Array.isArray(token.$extensions.generators) &&
    token.$extensions.generators.length > 0
  );
}

/**
 * Options for color generators extension
 */
export interface ColorGeneratorsExtensionOptions {
  filter?: TokenFilter;
}

const DEFAULT_FILTER: TokenFilter = { type: "color" };

/**
 * Create a color generators extension
 *
 * This extension generates new color tokens based on generator definitions
 * in the token's extensions. Generators can create variations like
 * lighter/darker shades, alpha variants, etc.
 *
 * This is a SCHEMA-PHASE extension, meaning it runs on the raw token tree
 * BEFORE alias resolution. This allows other tokens to reference the
 * generated tokens (e.g., {color.primary@alpha50}).
 */
export function colorGeneratorsExtension(
  options: ColorGeneratorsExtensionOptions = {},
): ProcessorExtension {
  const { filter = DEFAULT_FILTER } = options;

  return {
    name: "color-generators",
    phase: "schema", // Run BEFORE alias resolution
    filter,
    priority: 5,

    onSchemaToken(path: string, token: DesignToken, context: SchemaExtensionContext): void {
      // Check if token has generators
      if (!hasGeneratorsExtension(token)) {
        return;
      }

      const generators = token.$extensions.generators;

      // Get all modes we need to generate for
      const modes = [context.modes.defaultMode, ...context.modes.requiredModes].filter(
        (mode, index, arr) => arr.indexOf(mode) === index,
      );

      for (const generator of generators) {
        for (const [key, generatorValue] of Object.entries(generator.value)) {
          const newPath = `${path}${key}`;

          // Determine the amount
          const amount = typeof generatorValue === "number" ? generatorValue : generatorValue.value;

          // Generate the default value
          const defaultValue = context.getModeValue(token, context.modes.defaultMode);
          let generatedDefaultValue: unknown;

          try {
            generatedDefaultValue = normalizeColorValue(defaultValue, {
              type: generator.type,
              value: amount,
            });
          } catch (error) {
            context.logger.warn(
              `Failed to generate color for "${newPath}": ${error}`,
              path,
            );
            generatedDefaultValue = defaultValue;
          }

          // Generate mode values
          const generatedModeValues: Record<string, unknown> = {};
          for (const mode of modes) {
            if (mode === context.modes.defaultMode) continue;

            const modeValue = context.getModeValue(token, mode);
            try {
              generatedModeValues[mode] = normalizeColorValue(modeValue, {
                type: generator.type,
                value: amount,
              });
            } catch {
              generatedModeValues[mode] = generatedDefaultValue;
            }
          }

          // Create the generated token
          const generatedToken: DesignToken = {
            $type: "color",
            $value: generatedDefaultValue as Color,
            $description: `Generated from ${path} with ${generator.type}(${amount})`,
          };

          // Add mode values if any
          if (Object.keys(generatedModeValues).length > 0) {
            generatedToken.$extensions = { mode: generatedModeValues };
          }

          // Add the token to the tree
          context.addToken(newPath, generatedToken);
        }
      }
    },
  };
}
