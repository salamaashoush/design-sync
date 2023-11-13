"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
const { getStringIfConstant } = utils_1.ASTUtils;
const getName = (node) => {
    switch (node.type) {
        case "Literal":
            return typeof node.value === "string" ? node.value : null;
        case "Identifier":
            return node.name;
        case "AssignmentPattern":
            return getName(node.left);
        default:
            return getStringIfConstant(node);
    }
};
const getPropertyInfo = (prop) => {
    const valueName = getName(prop.value);
    if (valueName !== null) {
        return {
            real: prop.key,
            var: valueName,
            computed: prop.computed,
            init: prop.value.type === "AssignmentPattern" ? prop.value.right : undefined,
        };
    }
    else {
        return null;
    }
};
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Disallow destructuring props. In Solid, props must be used with property accesses (`props.foo`) to preserve reactivity. This rule only tracks destructuring in the parameter list.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/no-destructure.md",
        },
        fixable: "code",
        schema: [],
        messages: {
            noDestructure: "Destructuring component props breaks Solid's reactivity; use property access instead.",
        },
    },
    defaultOptions: [],
    create(context) {
        const functionStack = [];
        const currentFunction = () => functionStack[functionStack.length - 1];
        const onFunctionEnter = () => {
            functionStack.push({ hasJSX: false });
        };
        const onFunctionExit = (node) => {
            if (node.params.length === 1) {
                const props = node.params[0];
                if (props.type === "ObjectPattern" &&
                    currentFunction().hasJSX &&
                    node.parent?.type !== "JSXExpressionContainer") {
                    context.report({
                        node: props,
                        messageId: "noDestructure",
                        fix: (fixer) => fixDestructure(node, props, fixer),
                    });
                }
            }
            functionStack.pop();
        };
        function* fixDestructure(func, props, fixer) {
            const propsName = "props";
            const properties = props.properties;
            const propertyInfo = [];
            let rest = null;
            for (const property of properties) {
                if (property.type === "RestElement") {
                    rest = property;
                }
                else {
                    const info = getPropertyInfo(property);
                    if (info === null) {
                        continue;
                    }
                    propertyInfo.push(info);
                }
            }
            const hasDefaults = propertyInfo.some((info) => info.init);
            const origProps = !(hasDefaults || rest) ? propsName : "_" + propsName;
            if (props.typeAnnotation) {
                const range = [props.range[0], props.typeAnnotation.range[0]];
                yield fixer.replaceTextRange(range, origProps);
            }
            else {
                yield fixer.replaceText(props, origProps);
            }
            const sourceCode = context.getSourceCode();
            const defaultsObjectString = () => propertyInfo
                .filter((info) => info.init)
                .map((info) => `${info.computed ? "[" : ""}${sourceCode.getText(info.real)}${info.computed ? "]" : ""}: ${sourceCode.getText(info.init)}`)
                .join(", ");
            const splitPropsArray = () => `[${propertyInfo
                .map((info) => info.real.type === "Identifier"
                ? JSON.stringify(info.real.name)
                : sourceCode.getText(info.real))
                .join(", ")}]`;
            let lineToInsert = "";
            if (hasDefaults && rest) {
                lineToInsert = `  const [${propsName}, ${(rest.argument.type === "Identifier" && rest.argument.name) || "rest"}] = splitProps(mergeProps({ ${defaultsObjectString()} }, ${origProps}), ${splitPropsArray()});`;
            }
            else if (hasDefaults) {
                lineToInsert = `  const ${propsName} = mergeProps({ ${defaultsObjectString()} }, ${origProps});\n`;
            }
            else if (rest) {
                lineToInsert = `  const [${propsName}, ${(rest.argument.type === "Identifier" && rest.argument.name) || "rest"}] = splitProps(${origProps}, ${splitPropsArray()});\n`;
            }
            if (lineToInsert) {
                const body = func.body;
                if (body.type === "BlockStatement") {
                    if (body.body.length > 0) {
                        yield fixer.insertTextBefore(body.body[0], lineToInsert);
                    }
                }
                else {
                    const maybeOpenParen = sourceCode.getTokenBefore(body);
                    if (maybeOpenParen?.value === "(") {
                        yield fixer.remove(maybeOpenParen);
                    }
                    const maybeCloseParen = sourceCode.getTokenAfter(body);
                    if (maybeCloseParen?.value === ")") {
                        yield fixer.remove(maybeCloseParen);
                    }
                    yield fixer.insertTextBefore(body, `{\n${lineToInsert}  return (`);
                    yield fixer.insertTextAfter(body, `);\n}`);
                }
            }
            const scope = sourceCode.scopeManager?.acquire(func);
            if (scope) {
                for (const [info, variable] of propertyInfo.map((info) => [info, scope.set.get(info.var)])) {
                    if (variable) {
                        for (const reference of variable.references) {
                            if (reference.isReadOnly()) {
                                const access = info.real.type === "Identifier" && !info.computed
                                    ? `.${info.real.name}`
                                    : `[${sourceCode.getText(info.real)}]`;
                                yield fixer.replaceText(reference.identifier, `${propsName}${access}`);
                            }
                        }
                    }
                }
            }
        }
        return {
            FunctionDeclaration: onFunctionEnter,
            FunctionExpression: onFunctionEnter,
            ArrowFunctionExpression: onFunctionEnter,
            "FunctionDeclaration:exit": onFunctionExit,
            "FunctionExpression:exit": onFunctionExit,
            "ArrowFunctionExpression:exit": onFunctionExit,
            JSXElement() {
                if (functionStack.length) {
                    currentFunction().hasJSX = true;
                }
            },
            JSXFragment() {
                if (functionStack.length) {
                    currentFunction().hasJSX = true;
                }
            },
        };
    },
});
