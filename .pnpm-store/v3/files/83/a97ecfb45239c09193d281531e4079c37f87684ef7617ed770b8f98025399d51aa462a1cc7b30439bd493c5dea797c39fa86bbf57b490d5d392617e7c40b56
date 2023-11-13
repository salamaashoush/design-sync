"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("../utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
const { getPropertyName } = utils_1.ASTUtils;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Enforce using Solid's `<For />` component for mapping an array to JSX elements.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/prefer-for.md",
        },
        fixable: "code",
        schema: [],
        messages: {
            preferFor: "Use Solid's `<For />` component for efficiently rendering lists. Array#map causes DOM elements to be recreated.",
            preferForOrIndex: "Use Solid's `<For />` component or `<Index />` component for rendering lists. Array#map causes DOM elements to be recreated.",
        },
    },
    defaultOptions: [],
    create(context) {
        const reportPreferFor = (node) => {
            const jsxExpressionContainerNode = node.parent;
            const arrayNode = node.callee.object;
            const mapFnNode = node.arguments[0];
            context.report({
                node,
                messageId: "preferFor",
                fix: (fixer) => {
                    const beforeArray = [
                        jsxExpressionContainerNode.range[0],
                        arrayNode.range[0],
                    ];
                    const betweenArrayAndMapFn = [arrayNode.range[1], mapFnNode.range[0]];
                    const afterMapFn = [
                        mapFnNode.range[1],
                        jsxExpressionContainerNode.range[1],
                    ];
                    return [
                        fixer.replaceTextRange(beforeArray, "<For each={"),
                        fixer.replaceTextRange(betweenArrayAndMapFn, "}>{"),
                        fixer.replaceTextRange(afterMapFn, "}</For>"),
                    ];
                },
            });
        };
        return {
            CallExpression(node) {
                const callOrChain = node.parent?.type === "ChainExpression" ? node.parent : node;
                if (callOrChain.parent?.type === "JSXExpressionContainer" &&
                    callOrChain.parent.parent?.type === "JSXElement") {
                    if (node.callee.type === "MemberExpression" &&
                        getPropertyName(node.callee) === "map" &&
                        node.arguments.length === 1 &&
                        (0, utils_2.isFunctionNode)(node.arguments[0])) {
                        const mapFnNode = node.arguments[0];
                        if (mapFnNode.params.length === 1 && mapFnNode.params[0].type !== "RestElement") {
                            reportPreferFor(node);
                        }
                        else {
                            context.report({
                                node,
                                messageId: "preferForOrIndex",
                            });
                        }
                    }
                }
            },
        };
    },
});
