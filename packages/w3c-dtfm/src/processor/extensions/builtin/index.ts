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

import type { ProcessorExtension } from "../../types";
import { colorModifiersExtension } from "./color-modifiers";
import { colorGeneratorsExtension } from "./color-generators";

/**
 * Get all builtin extensions with default options
 */
export function getBuiltinExtensions(): ProcessorExtension[] {
  return [colorModifiersExtension(), colorGeneratorsExtension()];
}
