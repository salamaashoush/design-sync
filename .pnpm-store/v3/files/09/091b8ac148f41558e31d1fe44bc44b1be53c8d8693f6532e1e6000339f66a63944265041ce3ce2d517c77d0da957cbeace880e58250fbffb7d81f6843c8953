"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("../utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
function isComponent(node) {
    return ((node.name.type === "JSXIdentifier" && !(0, utils_2.isDOMElementName)(node.name.name)) ||
        node.name.type === "JSXMemberExpression");
}
const voidDOMElementRegex = /^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;
function isVoidDOMElementName(name) {
    return voidDOMElementRegex.test(name);
}
function childrenIsEmpty(node) {
    return node.parent.children.length === 0;
}
function childrenIsMultilineSpaces(node) {
    const childrens = node.parent.children;
    return (childrens.length === 1 &&
        childrens[0].type === "JSXText" &&
        childrens[0].value.indexOf("\n") !== -1 &&
        childrens[0].value.replace(/(?!\xA0)\s/g, "") === "");
}
exports.default = createRule({
    meta: {
        type: "layout",
        docs: {
            description: "Disallow extra closing tags for components without children.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/self-closing-comp.md",
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    component: {
                        type: "string",
                        description: "which Solid components should be self-closing when possible",
                        enum: ["all", "none"],
                        default: "all",
                    },
                    html: {
                        type: "string",
                        description: "which native elements should be self-closing when possible",
                        enum: ["all", "void", "none"],
                        default: "all",
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            selfClose: "Empty components are self-closing.",
            dontSelfClose: "This element should not be self-closing.",
        },
    },
    defaultOptions: [],
    create(context) {
        function shouldBeSelfClosedWhenPossible(node) {
            if (isComponent(node)) {
                const whichComponents = context.options[0]?.component ?? "all";
                return whichComponents === "all";
            }
            else if (node.name.type === "JSXIdentifier" && (0, utils_2.isDOMElementName)(node.name.name)) {
                const whichComponents = context.options[0]?.html ?? "all";
                switch (whichComponents) {
                    case "all":
                        return true;
                    case "void":
                        return isVoidDOMElementName(node.name.name);
                    case "none":
                        return false;
                }
            }
            return true;
        }
        return {
            JSXOpeningElement(node) {
                const canSelfClose = childrenIsEmpty(node) || childrenIsMultilineSpaces(node);
                if (canSelfClose) {
                    const shouldSelfClose = shouldBeSelfClosedWhenPossible(node);
                    if (shouldSelfClose && !node.selfClosing) {
                        context.report({
                            node,
                            messageId: "selfClose",
                            fix(fixer) {
                                const openingElementEnding = node.range[1] - 1;
                                const closingElementEnding = node.parent.closingElement.range[1];
                                const range = [openingElementEnding, closingElementEnding];
                                return fixer.replaceTextRange(range, " />");
                            },
                        });
                    }
                    else if (!shouldSelfClose && node.selfClosing) {
                        context.report({
                            node,
                            messageId: "dontSelfClose",
                            fix(fixer) {
                                const sourceCode = context.getSourceCode();
                                const tagName = context.getSourceCode().getText(node.name);
                                const selfCloseEnding = node.range[1];
                                const lastTokens = sourceCode.getLastTokens(node, { count: 3 });
                                const isSpaceBeforeSelfClose = sourceCode.isSpaceBetween?.(lastTokens[0], lastTokens[1]);
                                const range = [
                                    isSpaceBeforeSelfClose ? selfCloseEnding - 3 : selfCloseEnding - 2,
                                    selfCloseEnding,
                                ];
                                return fixer.replaceTextRange(range, `></${tagName}>`);
                            },
                        });
                    }
                }
            },
        };
    },
});
