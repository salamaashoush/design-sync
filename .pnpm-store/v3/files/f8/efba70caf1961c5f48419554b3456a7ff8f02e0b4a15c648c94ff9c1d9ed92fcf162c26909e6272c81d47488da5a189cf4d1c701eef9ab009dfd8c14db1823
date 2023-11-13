"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("../utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Disallow usage of type-unsafe event handlers.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/no-array-handlers.md",
        },
        schema: [],
        messages: {
            noArrayHandlers: "Passing an array as an event handler is potentially type-unsafe.",
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXAttribute(node) {
                const openingElement = node.parent;
                if (openingElement.name.type !== "JSXIdentifier" ||
                    !(0, utils_2.isDOMElementName)(openingElement.name.name)) {
                    return;
                }
                const isNamespacedHandler = node.name.type === "JSXNamespacedName" && node.name.namespace.name === "on";
                const isNormalEventHandler = node.name.type === "JSXIdentifier" && /^on[a-zA-Z]/.test(node.name.name);
                if ((isNamespacedHandler || isNormalEventHandler) &&
                    node.value?.type === "JSXExpressionContainer" &&
                    (0, utils_2.trace)(node.value.expression, context.getScope()).type === "ArrayExpression") {
                    context.report({
                        node,
                        messageId: "noArrayHandlers",
                    });
                }
            },
        };
    },
});
