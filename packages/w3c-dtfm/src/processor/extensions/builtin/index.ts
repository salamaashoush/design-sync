export {
  colorModifiersExtension,
  hasColorTokenModifiersExtension,
  type ColorModifiersExtensionOptions,
  type ColorTokenModifiersExtension,
} from "./color-modifiers";

export {
  colorGeneratorsExtension,
  hasGeneratorsExtension,
  type ColorGeneratorsExtensionOptions,
  type TokenGenerator,
  type TokenGeneratorsExtension,
} from "./color-generators";

export {
  responsiveExtension,
  DEFAULT_BREAKPOINTS,
  type ResponsiveExtensionOptions,
  type ResponsiveModifier,
} from "./responsive";

export {
  mathExpressionsExtension,
  type MathExpressionsOptions,
  type MathExpressionMetadata,
} from "./math-expressions";

export {
  compositionExtension,
  type CompositionMetadata,
  type CompositionPropertyInfo,
} from "./composition";

import type { ProcessorExtension } from "../../types";
import { colorModifiersExtension } from "./color-modifiers";
import { colorGeneratorsExtension } from "./color-generators";

/**
 * Get all builtin extensions with default options
 */
export function getBuiltinExtensions(): ProcessorExtension[] {
  return [colorModifiersExtension(), colorGeneratorsExtension()];
}
