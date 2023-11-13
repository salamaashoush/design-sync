"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const jsx_ast_utils_1 = require("jsx-ast-utils");
const utils_2 = require("../utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
const reactSpecificProps = [
    { from: "className", to: "class" },
    { from: "htmlFor", to: "for" },
];
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Disallow usage of React-specific `className`/`htmlFor` props, which were deprecated in v1.4.0.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/no-react-specific-props.md",
        },
        fixable: "code",
        schema: [],
        messages: {
            prefer: "Prefer the `{{ to }}` prop over the deprecated `{{ from }}` prop.",
            noUselessKey: "Elements in a <For> or <Index> list do not need a key prop.",
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXOpeningElement(node) {
                for (const { from, to } of reactSpecificProps) {
                    const classNameAttribute = (0, jsx_ast_utils_1.getProp)(node.attributes, from);
                    if (classNameAttribute) {
                        const fix = !(0, jsx_ast_utils_1.hasProp)(node.attributes, to, { ignoreCase: false })
                            ? (fixer) => fixer.replaceText(classNameAttribute.name, to)
                            : undefined;
                        context.report({
                            node: classNameAttribute,
                            messageId: "prefer",
                            data: { from, to },
                            fix,
                        });
                    }
                }
                if (node.name.type === "JSXIdentifier" && (0, utils_2.isDOMElementName)(node.name.name)) {
                    const keyProp = (0, jsx_ast_utils_1.getProp)(node.attributes, "key");
                    if (keyProp) {
                        context.report({
                            node: keyProp,
                            messageId: "noUselessKey",
                            fix: (fixer) => fixer.remove(keyProp),
                        });
                    }
                }
            },
        };
    },
});
