"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("../utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Disallow usage of APIs that use ES6 Proxies, only to target environments that don't support them.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/no-proxy-apis.md",
        },
        schema: [],
        messages: {
            noStore: "Solid Store APIs use Proxies, which are incompatible with your target environment.",
            spreadCall: "Using a function call in JSX spread makes Solid use Proxies, which are incompatible with your target environment.",
            spreadMember: "Using a property access in JSX spread makes Solid use Proxies, which are incompatible with your target environment.",
            proxyLiteral: "Proxies are incompatible with your target environment.",
            mergeProps: "If you pass a function to `mergeProps`, it will create a Proxy, which are incompatible with your target environment.",
        },
    },
    defaultOptions: [],
    create(context) {
        const { matchImport, handleImportDeclaration } = (0, utils_2.trackImports)();
        return {
            ImportDeclaration(node) {
                handleImportDeclaration(node);
                const source = node.source.value;
                if (source === "solid-js/store") {
                    context.report({
                        node,
                        messageId: "noStore",
                    });
                }
            },
            "JSXSpreadAttribute MemberExpression"(node) {
                context.report({ node, messageId: "spreadMember" });
            },
            "JSXSpreadAttribute CallExpression"(node) {
                context.report({ node, messageId: "spreadCall" });
            },
            CallExpression(node) {
                if (node.callee.type === "Identifier") {
                    if (matchImport("mergeProps", node.callee.name)) {
                        node.arguments
                            .filter((arg) => {
                            if (arg.type === "SpreadElement")
                                return true;
                            const traced = (0, utils_2.trace)(arg, context.getScope());
                            return ((traced.type === "Identifier" && !(0, utils_2.isPropsByName)(traced.name)) ||
                                (0, utils_2.isFunctionNode)(traced));
                        })
                            .forEach((badArg) => {
                            context.report({
                                node: badArg,
                                messageId: "mergeProps",
                            });
                        });
                    }
                }
                else if (node.callee.type === "MemberExpression") {
                    if (node.callee.object.type === "Identifier" &&
                        node.callee.object.name === "Proxy" &&
                        node.callee.property.type === "Identifier" &&
                        node.callee.property.name === "revocable") {
                        context.report({
                            node,
                            messageId: "proxyLiteral",
                        });
                    }
                }
            },
            NewExpression(node) {
                if (node.callee.type === "Identifier" && node.callee.name === "Proxy") {
                    context.report({ node, messageId: "proxyLiteral" });
                }
            },
        };
    },
});
