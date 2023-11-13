"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Prevent variables used in JSX from being marked as unused.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/jsx-uses-vars.md",
        },
        schema: [],
        messages: {},
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXOpeningElement(node) {
                let parent;
                switch (node.name.type) {
                    case "JSXNamespacedName":
                        return;
                    case "JSXIdentifier":
                        context.markVariableAsUsed(node.name.name);
                        break;
                    case "JSXMemberExpression":
                        parent = node.name.object;
                        while (parent?.type === "JSXMemberExpression") {
                            parent = parent.object;
                        }
                        if (parent.type === "JSXIdentifier") {
                            context.markVariableAsUsed(parent.name);
                        }
                        break;
                }
            },
            "JSXAttribute > JSXNamespacedName": (node) => {
                if (node.namespace?.type === "JSXIdentifier" &&
                    node.namespace.name === "use" &&
                    node.name?.type === "JSXIdentifier") {
                    context.markVariableAsUsed(node.name.name);
                }
            },
        };
    },
});
