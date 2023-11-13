"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const jsx_ast_utils_1 = require("jsx-ast-utils");
const is_html_1 = __importDefault(require("is-html"));
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
const { getStringIfConstant } = utils_1.ASTUtils;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Disallow usage of the innerHTML attribute, which can often lead to security vulnerabilities.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/no-innerhtml.md",
        },
        fixable: "code",
        hasSuggestions: true,
        schema: [
            {
                type: "object",
                properties: {
                    allowStatic: {
                        description: "if the innerHTML value is guaranteed to be a static HTML string (i.e. no user input), allow it",
                        type: "boolean",
                        default: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            dangerous: "The innerHTML attribute is dangerous; passing unsanitized input can lead to security vulnerabilities.",
            conflict: "The innerHTML attribute should not be used on an element with child elements; they will be overwritten.",
            notHtml: "The string passed to innerHTML does not appear to be valid HTML.",
            useInnerText: "For text content, using innerText is clearer and safer.",
            dangerouslySetInnerHTML: "The dangerouslySetInnerHTML prop is not supported; use innerHTML instead.",
        },
    },
    defaultOptions: [{ allowStatic: true }],
    create(context) {
        const allowStatic = Boolean(context.options[0]?.allowStatic ?? true);
        return {
            JSXAttribute(node) {
                if ((0, jsx_ast_utils_1.propName)(node) === "dangerouslySetInnerHTML") {
                    if (node.value?.type === "JSXExpressionContainer" &&
                        node.value.expression.type === "ObjectExpression" &&
                        node.value.expression.properties.length === 1) {
                        const htmlProp = node.value.expression.properties[0];
                        if (htmlProp.type === "Property" &&
                            htmlProp.key.type === "Identifier" &&
                            htmlProp.key.name === "__html") {
                            context.report({
                                node,
                                messageId: "dangerouslySetInnerHTML",
                                fix: (fixer) => {
                                    const propRange = node.range;
                                    const valueRange = htmlProp.value.range;
                                    return [
                                        fixer.replaceTextRange([propRange[0], valueRange[0]], "innerHTML={"),
                                        fixer.replaceTextRange([valueRange[1], propRange[1]], "}"),
                                    ];
                                },
                            });
                        }
                        else {
                            context.report({
                                node,
                                messageId: "dangerouslySetInnerHTML",
                            });
                        }
                    }
                    else {
                        context.report({
                            node,
                            messageId: "dangerouslySetInnerHTML",
                        });
                    }
                    return;
                }
                else if ((0, jsx_ast_utils_1.propName)(node) !== "innerHTML") {
                    return;
                }
                if (allowStatic) {
                    const innerHtmlNode = node.value?.type === "JSXExpressionContainer" ? node.value.expression : node.value;
                    const innerHtml = innerHtmlNode && getStringIfConstant(innerHtmlNode);
                    if (typeof innerHtml === "string") {
                        if ((0, is_html_1.default)(innerHtml)) {
                            if (node.parent?.parent?.type === "JSXElement" &&
                                node.parent.parent.children?.length) {
                                context.report({
                                    node: node.parent.parent,
                                    messageId: "conflict",
                                });
                            }
                        }
                        else {
                            context.report({
                                node,
                                messageId: "notHtml",
                                suggest: [
                                    {
                                        fix: (fixer) => fixer.replaceText(node.name, "innerText"),
                                        messageId: "useInnerText",
                                    },
                                ],
                            });
                        }
                    }
                    else {
                        context.report({
                            node,
                            messageId: "dangerous",
                        });
                    }
                }
                else {
                    context.report({
                        node,
                        messageId: "dangerous",
                    });
                }
            },
        };
    },
});
