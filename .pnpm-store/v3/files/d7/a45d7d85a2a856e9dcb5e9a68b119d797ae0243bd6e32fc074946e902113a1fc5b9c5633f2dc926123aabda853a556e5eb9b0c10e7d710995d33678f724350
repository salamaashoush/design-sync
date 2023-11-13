"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const kebab_case_1 = __importDefault(require("kebab-case"));
const known_css_properties_1 = require("known-css-properties");
const style_to_object_1 = __importDefault(require("style-to-object"));
const jsx_ast_utils_1 = require("jsx-ast-utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
const { getPropertyName, getStaticValue } = utils_1.ASTUtils;
const lengthPercentageRegex = /\b(?:width|height|margin|padding|border-width|font-size)\b/i;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Require CSS properties in the `style` prop to be valid and kebab-cased (ex. 'font-size'), not camel-cased (ex. 'fontSize') like in React, " +
                "and that property values with dimensions are strings, not numbers with implicit 'px' units.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/style-prop.md",
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    styleProps: {
                        description: "an array of prop names to treat as a CSS style object",
                        default: ["style"],
                        type: "array",
                        items: {
                            type: "string",
                        },
                        minItems: 1,
                        uniqueItems: true,
                    },
                    allowString: {
                        description: "if allowString is set to true, this rule will not convert a style string literal into a style object (not recommended for performance)",
                        type: "boolean",
                        default: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            kebabStyleProp: "Use {{ kebabName }} instead of {{ name }}.",
            invalidStyleProp: "{{ name }} is not a valid CSS property.",
            numericStyleValue: 'This CSS property value should be a string with a unit; Solid does not automatically append a "px" unit.',
            stringStyle: "Use an object for the style prop instead of a string.",
        },
    },
    defaultOptions: [],
    create(context) {
        const allCssPropertiesSet = new Set(known_css_properties_1.all);
        const allowString = Boolean(context.options[0]?.allowString);
        const styleProps = context.options[0]?.styleProps || ["style"];
        return {
            JSXAttribute(node) {
                if (styleProps.indexOf((0, jsx_ast_utils_1.propName)(node)) === -1) {
                    return;
                }
                const style = node.value?.type === "JSXExpressionContainer" ? node.value.expression : node.value;
                if (!style) {
                    return;
                }
                else if (style.type === "Literal" && typeof style.value === "string" && !allowString) {
                    let objectStyles;
                    try {
                        objectStyles = (0, style_to_object_1.default)(style.value) ?? undefined;
                    }
                    catch (e) { }
                    context.report({
                        node: style,
                        messageId: "stringStyle",
                        fix: objectStyles &&
                            ((fixer) => fixer.replaceText(node.value, `{${JSON.stringify(objectStyles)}}`)),
                    });
                }
                else if (style.type === "TemplateLiteral" && !allowString) {
                    context.report({
                        node: style,
                        messageId: "stringStyle",
                    });
                }
                else if (style.type === "ObjectExpression") {
                    const properties = style.properties.filter((prop) => prop.type === "Property");
                    properties.forEach((prop) => {
                        const name = getPropertyName(prop, context.getScope());
                        if (name && !name.startsWith("--") && !allCssPropertiesSet.has(name)) {
                            const kebabName = (0, kebab_case_1.default)(name);
                            if (allCssPropertiesSet.has(kebabName)) {
                                context.report({
                                    node: prop.key,
                                    messageId: "kebabStyleProp",
                                    data: { name, kebabName },
                                    fix: (fixer) => fixer.replaceText(prop.key, `"${kebabName}"`),
                                });
                            }
                            else {
                                context.report({
                                    node: prop.key,
                                    messageId: "invalidStyleProp",
                                    data: { name },
                                });
                            }
                        }
                        else if (!name || (!name.startsWith("--") && lengthPercentageRegex.test(name))) {
                            const value = getStaticValue(prop.value)?.value;
                            if (typeof value === "number" && value !== 0) {
                                context.report({ node: prop.value, messageId: "numericStyleValue" });
                            }
                        }
                    });
                }
            },
        };
    },
});
