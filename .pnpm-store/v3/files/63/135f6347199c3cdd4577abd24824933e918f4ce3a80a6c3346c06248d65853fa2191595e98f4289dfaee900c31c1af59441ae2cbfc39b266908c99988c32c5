"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
const { getStaticValue } = utils_1.ASTUtils;
const isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Disallow javascript: URLs.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/jsx-no-script-url.md",
        },
        schema: [],
        messages: {
            noJSURL: "For security, don't use javascript: URLs. Use event handlers instead if you can.",
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXAttribute(node) {
                if (node.name.type === "JSXIdentifier" && node.value) {
                    const link = getStaticValue(node.value.type === "JSXExpressionContainer" ? node.value.expression : node.value, context.getScope());
                    if (link && typeof link.value === "string" && isJavaScriptProtocol.test(link.value)) {
                        context.report({
                            node: node.value,
                            messageId: "noJSURL",
                        });
                    }
                }
            },
        };
    },
});
