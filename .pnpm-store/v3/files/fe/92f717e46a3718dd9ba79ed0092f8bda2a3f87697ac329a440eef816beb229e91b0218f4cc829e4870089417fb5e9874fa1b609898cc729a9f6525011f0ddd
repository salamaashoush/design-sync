"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Disallow passing the same prop twice in JSX.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/jsx-no-duplicate-props.md",
        },
        schema: [
            {
                type: "object",
                properties: {
                    ignoreCase: {
                        type: "boolean",
                        description: "Consider two prop names differing only by case to be the same.",
                        default: false,
                    },
                },
            },
        ],
        messages: {
            noDuplicateProps: "Duplicate props are not allowed.",
            noDuplicateClass: "Duplicate `class` props are not allowed; while it might seem to work, it can break unexpectedly. Use `classList` instead.",
            noDuplicateChildren: "Using {{used}} at the same time is not allowed.",
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXOpeningElement(node) {
                const ignoreCase = context.options[0]?.ignoreCase ?? false;
                const props = new Set();
                const checkPropName = (name, node) => {
                    if (ignoreCase || name.startsWith("on")) {
                        name = name
                            .toLowerCase()
                            .replace(/^on(?:capture)?:/, "on")
                            .replace(/^(?:attr|prop):/, "");
                    }
                    if (props.has(name)) {
                        context.report({
                            node,
                            messageId: name === "class" ? "noDuplicateClass" : "noDuplicateProps",
                        });
                    }
                    props.add(name);
                };
                node.attributes.forEach((decl) => {
                    if (decl.type === "JSXSpreadAttribute") {
                        if (decl.argument.type === "ObjectExpression") {
                            for (const prop of decl.argument.properties) {
                                if (prop.type === "Property") {
                                    if (prop.key.type === "Identifier") {
                                        checkPropName(prop.key.name, prop.key);
                                    }
                                    else if (prop.key.type === "Literal") {
                                        checkPropName(String(prop.key.value), prop.key);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        const name = decl.name.type === "JSXNamespacedName"
                            ? `${decl.name.namespace.name}:${decl.name.name.name}`
                            : decl.name.name;
                        checkPropName(name, decl.name);
                    }
                });
                const hasChildrenProp = props.has("children");
                const hasChildren = node.parent.children.length > 0;
                const hasInnerHTML = props.has("innerHTML") || props.has("innerhtml");
                const hasTextContent = props.has("textContent") || props.has("textContent");
                const used = [
                    hasChildrenProp && "`props.children`",
                    hasChildren && "JSX children",
                    hasInnerHTML && "`props.innerHTML`",
                    hasTextContent && "`props.textContent`",
                ].filter(Boolean);
                if (used.length > 1) {
                    context.report({
                        node,
                        messageId: "noDuplicateChildren",
                        data: {
                            used: used.join(", "),
                        },
                    });
                }
            },
        };
    },
});
