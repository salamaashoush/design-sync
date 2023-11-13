"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("../utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Disallow usage of dependency arrays in `createEffect` and `createMemo`.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/no-react-deps.md",
        },
        fixable: "code",
        schema: [],
        messages: {
            noUselessDep: "In Solid, `{{name}}` doesn't accept a dependency array because it automatically tracks its dependencies. If you really need to override the list of dependencies, use `on`.",
        },
    },
    defaultOptions: [],
    create(context) {
        const { matchImport, handleImportDeclaration } = (0, utils_2.trackImports)();
        return {
            ImportDeclaration: handleImportDeclaration,
            CallExpression(node) {
                if (node.callee.type === "Identifier" &&
                    matchImport(["createEffect", "createMemo"], node.callee.name) &&
                    node.arguments.length === 2 &&
                    node.arguments.every((arg) => arg.type !== "SpreadElement")) {
                    const [arg0, arg1] = node.arguments.map((arg) => (0, utils_2.trace)(arg, context.getScope()));
                    if ((0, utils_2.isFunctionNode)(arg0) && arg0.params.length === 0 && arg1.type === "ArrayExpression") {
                        context.report({
                            node: node.arguments[1],
                            messageId: "noUselessDep",
                            data: {
                                name: node.callee.name,
                            },
                            fix: arg1 === node.arguments[1] ? (fixer) => fixer.remove(arg1) : undefined,
                        });
                    }
                }
            },
        };
    },
});
