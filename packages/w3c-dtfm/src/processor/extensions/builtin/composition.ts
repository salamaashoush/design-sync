import type { DesignToken } from "../../../types";
import type { ProcessorExtension, SchemaExtensionContext } from "../../types";

export interface CompositionPropertyInfo {
  /** The raw value (typically a token reference like `{colors.surface}`) */
  value: string;
  /** The CSS property name for this composition property */
  cssProperty: string;
  /** The inferred token type from the referenced token, if available */
  inferredType?: string;
}

export interface CompositionMetadata {
  /** Map of composition property names to their info */
  properties: Record<string, CompositionPropertyInfo>;
}

/**
 * Map of known composition property names to their CSS equivalents.
 */
const PROPERTY_CSS_MAP: Record<string, string> = {
  fill: "background",
  background: "background",
  backgroundColor: "background-color",
  textColor: "color",
  color: "color",
  borderRadius: "border-radius",
  borderColor: "border-color",
  borderWidth: "border-width",
  borderStyle: "border-style",
  border: "border",
  shadow: "box-shadow",
  boxShadow: "box-shadow",
  opacity: "opacity",
  fontSize: "font-size",
  fontFamily: "font-family",
  fontWeight: "font-weight",
  lineHeight: "line-height",
  letterSpacing: "letter-spacing",
  padding: "padding",
  paddingTop: "padding-top",
  paddingRight: "padding-right",
  paddingBottom: "padding-bottom",
  paddingLeft: "padding-left",
  margin: "margin",
  marginTop: "margin-top",
  marginRight: "margin-right",
  marginBottom: "margin-bottom",
  marginLeft: "margin-left",
  gap: "gap",
  width: "width",
  height: "height",
  minWidth: "min-width",
  minHeight: "min-height",
  maxWidth: "max-width",
  maxHeight: "max-height",
};

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Schema-phase extension that processes `$type: "composition"` tokens.
 *
 * Stores structured metadata in `$extensions["design-sync.composition"]` for plugin consumption.
 * Plugins (e.g. CSS) read this metadata to generate CSS classes with proper property mappings.
 *
 * Example input:
 * ```json
 * {
 *   "card": {
 *     "$type": "composition",
 *     "$value": {
 *       "fill": "{colors.surface}",
 *       "borderRadius": "{radii.md}",
 *       "shadow": "{shadows.elevation.1}"
 *     }
 *   }
 * }
 * ```
 */
export function compositionExtension(): ProcessorExtension {
  return {
    name: "composition",
    phase: "schema",

    onSchemaToken(path: string, token: DesignToken, context: SchemaExtensionContext) {
      // Composition is a custom type not in the W3C spec
      if ((token.$type as string) !== "composition") return;

      const value = token.$value as unknown;
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        context.logger.warn(`Composition token "${path}" has invalid value — expected object`);
        return;
      }

      const props = value as Record<string, unknown>;
      const properties: Record<string, CompositionPropertyInfo> = {};

      for (const [propName, propValue] of Object.entries(props)) {
        // Determine CSS property name
        const cssProperty = PROPERTY_CSS_MAP[propName] ?? toKebabCase(propName);

        // Convert value to string representation
        let strValue: string;
        if (typeof propValue === "string") {
          strValue = propValue;
        } else if (
          typeof propValue === "object" &&
          propValue !== null &&
          "value" in propValue &&
          "unit" in propValue
        ) {
          // W3C dimension/duration format {value, unit} (e.g. from migration)
          const dim = propValue as { value: number; unit: string };
          strValue = `${dim.value}${dim.unit}`;
        } else if (typeof propValue === "number") {
          strValue = String(propValue);
        } else {
          continue;
        }

        // Try to infer type from referenced token
        const refMatch = strValue.match(/^\{(.+)\}$/);
        let inferredType: string | undefined;
        if (refMatch) {
          const referencedToken = context.getToken(refMatch[1]);
          inferredType = referencedToken?.$type as string | undefined;
        }

        properties[propName] = { value: strValue, cssProperty, inferredType };
      }

      if (!token.$extensions) {
        token.$extensions = {};
      }

      const metadata: CompositionMetadata = { properties };
      token.$extensions["design-sync.composition"] = metadata;
    },
  };
}
