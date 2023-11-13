"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("../utils");
const { findVariable, getFunctionHeadLocation } = utils_1.ASTUtils;
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
class ScopeStackItem {
    constructor(node) {
        this.trackedScopes = [];
        this.unnamedDerivedSignals = new Set();
        this.hasJSX = false;
        this.node = node;
    }
}
class ScopeStack extends Array {
    constructor() {
        super(...arguments);
        this.currentScope = () => this[this.length - 1];
        this.parentScope = () => this[this.length - 2];
        this.syncCallbacks = new Set();
        this.findDeepestDeclarationScope = (a, b) => {
            if (a === b)
                return a;
            for (let i = this.length - 1; i >= 0; i -= 1) {
                const { node } = this[i];
                if (a === node || b === node) {
                    return node;
                }
            }
            throw new Error("This should never happen");
        };
        this.signals = [];
        this.props = [];
    }
    pushSignal(variable, declarationScope = this.currentScope().node) {
        this.signals.push({
            references: variable.references.filter((reference) => !reference.init),
            variable,
            declarationScope,
        });
    }
    pushUniqueSignal(variable, declarationScope) {
        const foundSignal = this.signals.find((s) => s.variable === variable);
        if (!foundSignal) {
            this.pushSignal(variable, declarationScope);
        }
        else {
            foundSignal.declarationScope = this.findDeepestDeclarationScope(foundSignal.declarationScope, declarationScope);
        }
    }
    pushProps(variable, declarationScope = this.currentScope().node) {
        this.props.push({
            references: variable.references.filter((reference) => !reference.init),
            variable,
            declarationScope,
        });
    }
    *consumeSignalReferencesInScope() {
        yield* this.consumeReferencesInScope(this.signals);
        this.signals = this.signals.filter((variable) => variable.references.length !== 0);
    }
    *consumePropsReferencesInScope() {
        yield* this.consumeReferencesInScope(this.props);
        this.props = this.props.filter((variable) => variable.references.length !== 0);
    }
    *consumeReferencesInScope(variables) {
        for (const variable of variables) {
            const { references } = variable;
            const inScope = [], notInScope = [];
            references.forEach((reference) => {
                if (this.isReferenceInCurrentScope(reference)) {
                    inScope.push(reference);
                }
                else {
                    notInScope.push(reference);
                }
            });
            yield* inScope.map((reference) => ({
                reference,
                declarationScope: variable.declarationScope,
            }));
            variable.references = notInScope;
        }
    }
    isReferenceInCurrentScope(reference) {
        let parentFunction = (0, utils_2.findParent)(reference.identifier, utils_2.isProgramOrFunctionNode);
        while ((0, utils_2.isFunctionNode)(parentFunction) && this.syncCallbacks.has(parentFunction)) {
            parentFunction = (0, utils_2.findParent)(parentFunction, utils_2.isProgramOrFunctionNode);
        }
        return parentFunction === this.currentScope().node;
    }
}
const getNthDestructuredVar = (id, n, scope) => {
    if (id?.type === "ArrayPattern") {
        const el = id.elements[n];
        if (el?.type === "Identifier") {
            return findVariable(scope, el.name);
        }
    }
    return null;
};
const getReturnedVar = (id, scope) => {
    if (id.type === "Identifier") {
        return findVariable(scope, id.name);
    }
    return null;
};
exports.default = createRule({
    meta: {
        type: "problem",
        docs: {
            description: "Enforce that reactivity (props, signals, memos, etc.) is properly used, so changes in those values will be tracked and update the view as expected.",
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/reactivity.md",
        },
        schema: [],
        messages: {
            noWrite: "The reactive variable '{{name}}' should not be reassigned or altered directly.",
            untrackedReactive: "The reactive variable '{{name}}' should be used within JSX, a tracked scope (like createEffect), or inside an event handler function, or else changes will be ignored.",
            expectedFunctionGotExpression: "The reactive variable '{{name}}' should be wrapped in a function for reactivity. This includes event handler bindings on native elements, which are not reactive like other JSX props.",
            badSignal: "The reactive variable '{{name}}' should be called as a function when used in {{where}}.",
            badUnnamedDerivedSignal: "This function should be passed to a tracked scope (like createEffect) or an event handler because it contains reactivity, or else changes will be ignored.",
            shouldDestructure: "For proper analysis, array destructuring should be used to capture the {{nth}}result of this function call.",
            shouldAssign: "For proper analysis, a variable should be used to capture the result of this function call.",
            noAsyncTrackedScope: "This tracked scope should not be async. Solid's reactivity only tracks synchronously.",
        },
    },
    defaultOptions: [],
    create(context) {
        const warnShouldDestructure = (node, nth) => context.report({
            node,
            messageId: "shouldDestructure",
            data: nth ? { nth: nth + " " } : undefined,
        });
        const warnShouldAssign = (node) => context.report({ node, messageId: "shouldAssign" });
        const sourceCode = context.getSourceCode();
        const scopeStack = new ScopeStack();
        const { currentScope, parentScope } = scopeStack;
        const { matchImport, handleImportDeclaration } = (0, utils_2.trackImports)();
        const markPropsOnCondition = (node, cb) => {
            if (node.params.length === 1 &&
                node.params[0].type === "Identifier" &&
                node.parent?.type !== "JSXExpressionContainer" &&
                node.parent?.type !== "TemplateLiteral" &&
                cb(node.params[0])) {
                const propsParam = findVariable(context.getScope(), node.params[0]);
                if (propsParam) {
                    scopeStack.pushProps(propsParam, node);
                }
            }
        };
        const onFunctionEnter = (node) => {
            if ((0, utils_2.isFunctionNode)(node)) {
                markPropsOnCondition(node, (props) => (0, utils_2.isPropsByName)(props.name));
                if (scopeStack.syncCallbacks.has(node)) {
                    return;
                }
            }
            scopeStack.push(new ScopeStackItem(node));
        };
        const matchTrackedScope = (trackedScope, node) => {
            switch (trackedScope.expect) {
                case "function":
                case "called-function":
                    return node === trackedScope.node;
                case "expression":
                    return Boolean((0, utils_2.findInScope)(node, currentScope().node, (node) => node === trackedScope.node));
            }
        };
        const handleTrackedScopes = (identifier, declarationScope) => {
            const currentScopeNode = currentScope().node;
            if (!currentScope().trackedScopes.find((trackedScope) => matchTrackedScope(trackedScope, identifier))) {
                const matchedExpression = currentScope().trackedScopes.find((trackedScope) => matchTrackedScope({ ...trackedScope, expect: "expression" }, identifier));
                if (declarationScope === currentScopeNode) {
                    let parentMemberExpression = null;
                    if (identifier.parent?.type === "MemberExpression") {
                        parentMemberExpression = identifier.parent;
                        while (parentMemberExpression.parent?.type === "MemberExpression") {
                            parentMemberExpression = parentMemberExpression.parent;
                        }
                    }
                    const parentCallExpression = identifier.parent?.type === "CallExpression" ? identifier.parent : null;
                    context.report({
                        node: parentMemberExpression ?? parentCallExpression ?? identifier,
                        messageId: matchedExpression ? "expectedFunctionGotExpression" : "untrackedReactive",
                        data: {
                            name: parentMemberExpression
                                ? sourceCode.getText(parentMemberExpression)
                                : identifier.name,
                        },
                    });
                }
                else {
                    if (!parentScope() || !(0, utils_2.isFunctionNode)(currentScopeNode)) {
                        throw new Error("this shouldn't happen!");
                    }
                    const pushUnnamedDerivedSignal = () => (parentScope().unnamedDerivedSignals ??= new Set()).add(currentScopeNode);
                    if (currentScopeNode.type === "FunctionDeclaration") {
                        const functionVariable = sourceCode.scopeManager?.getDeclaredVariables(currentScopeNode)?.[0];
                        if (functionVariable) {
                            scopeStack.pushUniqueSignal(functionVariable, declarationScope);
                        }
                        else {
                            pushUnnamedDerivedSignal();
                        }
                    }
                    else if (currentScopeNode.parent?.type === "VariableDeclarator") {
                        const declarator = currentScopeNode.parent;
                        const functionVariable = sourceCode.scopeManager?.getDeclaredVariables(declarator)?.[0];
                        if (functionVariable) {
                            scopeStack.pushUniqueSignal(functionVariable, declarationScope);
                        }
                        else {
                            pushUnnamedDerivedSignal();
                        }
                    }
                    else if (currentScopeNode.parent?.type === "Property") {
                    }
                    else {
                        pushUnnamedDerivedSignal();
                    }
                }
            }
        };
        const onFunctionExit = (currentScopeNode) => {
            if ((0, utils_2.isFunctionNode)(currentScopeNode)) {
                markPropsOnCondition(currentScopeNode, (props) => !(0, utils_2.isPropsByName)(props.name) &&
                    currentScope().hasJSX &&
                    (currentScopeNode.type !== "FunctionDeclaration" ||
                        !currentScopeNode.id?.name?.match(/^[a-z]/)));
            }
            if ((0, utils_2.isFunctionNode)(currentScopeNode) && scopeStack.syncCallbacks.has(currentScopeNode)) {
                return;
            }
            for (const { reference, declarationScope } of scopeStack.consumeSignalReferencesInScope()) {
                const identifier = reference.identifier;
                if (reference.isWrite()) {
                    context.report({
                        node: identifier,
                        messageId: "noWrite",
                        data: {
                            name: identifier.name,
                        },
                    });
                }
                else if (identifier.type === "Identifier") {
                    const reportBadSignal = (where) => context.report({
                        node: identifier,
                        messageId: "badSignal",
                        data: { name: identifier.name, where },
                    });
                    if (identifier.parent?.type === "CallExpression" ||
                        (identifier.parent?.type === "ArrayExpression" &&
                            identifier.parent.parent?.type === "CallExpression")) {
                        handleTrackedScopes(identifier, declarationScope);
                    }
                    else if (identifier.parent?.type === "TemplateLiteral") {
                        reportBadSignal("template literals");
                    }
                    else if (identifier.parent?.type === "BinaryExpression" &&
                        [
                            "<",
                            "<=",
                            ">",
                            ">=",
                            "<<",
                            ">>",
                            ">>>",
                            "+",
                            "-",
                            "*",
                            "/",
                            "%",
                            "**",
                            "|",
                            "^",
                            "&",
                            "in",
                        ].includes(identifier.parent.operator)) {
                        reportBadSignal("arithmetic or comparisons");
                    }
                    else if (identifier.parent?.type === "UnaryExpression" &&
                        ["-", "+", "~"].includes(identifier.parent.operator)) {
                        reportBadSignal("unary expressions");
                    }
                    else if (identifier.parent?.type === "MemberExpression" &&
                        identifier.parent.computed &&
                        identifier.parent.property === identifier) {
                        reportBadSignal("property accesses");
                    }
                    else if (identifier.parent?.type === "JSXExpressionContainer" &&
                        !currentScope().trackedScopes.find((trackedScope) => trackedScope.node === identifier &&
                            (trackedScope.expect === "function" || trackedScope.expect === "called-function"))) {
                        const elementOrAttribute = identifier.parent.parent;
                        if (elementOrAttribute?.type === "JSXElement" ||
                            (elementOrAttribute?.type === "JSXAttribute" &&
                                elementOrAttribute.parent?.type === "JSXOpeningElement" &&
                                elementOrAttribute.parent.name.type === "JSXIdentifier" &&
                                (0, utils_2.isDOMElementName)(elementOrAttribute.parent.name.name))) {
                            reportBadSignal("JSX");
                        }
                    }
                }
            }
            for (const { reference, declarationScope } of scopeStack.consumePropsReferencesInScope()) {
                const identifier = reference.identifier;
                if (reference.isWrite()) {
                    context.report({
                        node: identifier,
                        messageId: "noWrite",
                        data: {
                            name: identifier.name,
                        },
                    });
                }
                else if (identifier.parent?.type === "MemberExpression" &&
                    identifier.parent.object === identifier) {
                    const { parent } = identifier;
                    if (parent.parent?.type === "AssignmentExpression" && parent.parent.left === parent) {
                        context.report({
                            node: identifier,
                            messageId: "noWrite",
                            data: {
                                name: identifier.name,
                            },
                        });
                    }
                    else if (parent.property.type === "Identifier" &&
                        /^(?:initial|default|static)[A-Z]/.test(parent.property.name)) {
                    }
                    else {
                        handleTrackedScopes(identifier, declarationScope);
                    }
                }
                else if (identifier.parent?.type === "AssignmentExpression" ||
                    identifier.parent?.type === "VariableDeclarator") {
                    context.report({
                        node: identifier,
                        messageId: "untrackedReactive",
                        data: { name: identifier.name },
                    });
                }
            }
            const { unnamedDerivedSignals } = currentScope();
            if (unnamedDerivedSignals) {
                for (const node of unnamedDerivedSignals) {
                    if (!currentScope().trackedScopes.find((trackedScope) => matchTrackedScope(trackedScope, node))) {
                        context.report({
                            loc: getFunctionHeadLocation(node, sourceCode),
                            messageId: "badUnnamedDerivedSignal",
                        });
                    }
                }
            }
            scopeStack.pop();
        };
        const checkForSyncCallbacks = (node) => {
            if (node.arguments.length === 1 &&
                (0, utils_2.isFunctionNode)(node.arguments[0]) &&
                !node.arguments[0].async) {
                if (node.callee.type === "Identifier" &&
                    matchImport(["batch", "produce"], node.callee.name)) {
                    scopeStack.syncCallbacks.add(node.arguments[0]);
                }
                else if (node.callee.type === "MemberExpression" &&
                    !node.callee.computed &&
                    node.callee.object.type !== "ObjectExpression" &&
                    /^(?:forEach|map|flatMap|reduce|reduceRight|find|findIndex|filter|every|some)$/.test(node.callee.property.name)) {
                    scopeStack.syncCallbacks.add(node.arguments[0]);
                }
            }
            if (node.callee.type === "Identifier") {
                if (matchImport(["createSignal", "createStore"], node.callee.name) &&
                    node.parent?.type === "VariableDeclarator") {
                    const setter = getNthDestructuredVar(node.parent.id, 1, context.getScope());
                    if (setter) {
                        for (const reference of setter.references) {
                            const { identifier } = reference;
                            if (!reference.init &&
                                reference.isRead() &&
                                identifier.parent?.type === "CallExpression") {
                                for (const arg of identifier.parent.arguments) {
                                    if ((0, utils_2.isFunctionNode)(arg) && !arg.async) {
                                        scopeStack.syncCallbacks.add(arg);
                                    }
                                }
                            }
                        }
                    }
                }
                else if (matchImport(["mapArray", "indexArray"], node.callee.name)) {
                    const arg1 = node.arguments[1];
                    if ((0, utils_2.isFunctionNode)(arg1)) {
                        scopeStack.syncCallbacks.add(arg1);
                    }
                }
            }
            if ((0, utils_2.isFunctionNode)(node.callee)) {
                scopeStack.syncCallbacks.add(node.callee);
            }
        };
        const checkForReactiveAssignment = (id, init) => {
            init = (0, utils_2.ignoreTransparentWrappers)(init);
            if (init.type === "CallExpression" && init.callee.type === "Identifier") {
                const { callee } = init;
                if (matchImport(["createSignal", "useTransition"], callee.name)) {
                    const signal = id && getNthDestructuredVar(id, 0, context.getScope());
                    if (signal) {
                        scopeStack.pushSignal(signal, currentScope().node);
                    }
                    else {
                        warnShouldDestructure(id ?? init, "first");
                    }
                }
                else if (matchImport(["createMemo", "createSelector"], callee.name)) {
                    const memo = id && getReturnedVar(id, context.getScope());
                    if (memo) {
                        scopeStack.pushSignal(memo, currentScope().node);
                    }
                    else {
                        warnShouldAssign(id ?? init);
                    }
                }
                else if (matchImport("createStore", callee.name)) {
                    const store = id && getNthDestructuredVar(id, 0, context.getScope());
                    if (store) {
                        scopeStack.pushProps(store, currentScope().node);
                    }
                    else {
                        warnShouldDestructure(id ?? init, "first");
                    }
                }
                else if (matchImport("mergeProps", callee.name)) {
                    const merged = id && getReturnedVar(id, context.getScope());
                    if (merged) {
                        scopeStack.pushProps(merged, currentScope().node);
                    }
                    else {
                        warnShouldAssign(id ?? init);
                    }
                }
                else if (matchImport("splitProps", callee.name)) {
                    if (id?.type === "ArrayPattern") {
                        const vars = id.elements
                            .map((_, i) => getNthDestructuredVar(id, i, context.getScope()))
                            .filter(Boolean);
                        if (vars.length === 0) {
                            warnShouldDestructure(id);
                        }
                        else {
                            vars.forEach((variable) => {
                                scopeStack.pushProps(variable, currentScope().node);
                            });
                        }
                    }
                    else {
                        const vars = id && getReturnedVar(id, context.getScope());
                        if (vars) {
                            scopeStack.pushProps(vars, currentScope().node);
                        }
                    }
                }
                else if (matchImport("createResource", callee.name)) {
                    const resourceReturn = id && getNthDestructuredVar(id, 0, context.getScope());
                    if (resourceReturn) {
                        scopeStack.pushProps(resourceReturn, currentScope().node);
                    }
                }
                else if (matchImport("createMutable", callee.name)) {
                    const mutable = id && getReturnedVar(id, context.getScope());
                    if (mutable) {
                        scopeStack.pushProps(mutable, currentScope().node);
                    }
                }
                else if (matchImport("mapArray", callee.name)) {
                    const arg1 = init.arguments[1];
                    if ((0, utils_2.isFunctionNode)(arg1) &&
                        arg1.params.length >= 2 &&
                        arg1.params[1].type === "Identifier") {
                        const indexSignal = findVariable(context.getScope(), arg1.params[1]);
                        if (indexSignal) {
                            scopeStack.pushSignal(indexSignal);
                        }
                    }
                }
                else if (matchImport("indexArray", callee.name)) {
                    const arg1 = init.arguments[1];
                    if ((0, utils_2.isFunctionNode)(arg1) &&
                        arg1.params.length >= 1 &&
                        arg1.params[0].type === "Identifier") {
                        const valueSignal = findVariable(context.getScope(), arg1.params[0]);
                        if (valueSignal) {
                            scopeStack.pushSignal(valueSignal);
                        }
                    }
                }
            }
        };
        const checkForTrackedScopes = (node) => {
            const pushTrackedScope = (node, expect) => {
                currentScope().trackedScopes.push({ node, expect });
                if (expect !== "called-function" && (0, utils_2.isFunctionNode)(node) && node.async) {
                    context.report({
                        node,
                        messageId: "noAsyncTrackedScope",
                    });
                }
            };
            if (node.type === "JSXExpressionContainer") {
                if (node.parent?.type === "JSXAttribute" &&
                    /^on[:A-Z]/.test(sourceCode.getText(node.parent.name)) &&
                    node.parent.parent?.type === "JSXOpeningElement" &&
                    node.parent.parent.name.type === "JSXIdentifier" &&
                    (0, utils_2.isDOMElementName)(node.parent.parent.name.name)) {
                    pushTrackedScope(node.expression, "called-function");
                }
                else if (node.parent?.type === "JSXAttribute" &&
                    node.parent.name.type === "JSXNamespacedName" &&
                    node.parent.name.namespace.name === "use" &&
                    (0, utils_2.isFunctionNode)(node.expression)) {
                    pushTrackedScope(node.expression, "called-function");
                }
                else if (node.parent?.type === "JSXAttribute" &&
                    node.parent.name.name === "value" &&
                    node.parent.parent?.type === "JSXOpeningElement" &&
                    ((node.parent.parent.name.type === "JSXIdentifier" &&
                        node.parent.parent.name.name.endsWith("Provider")) ||
                        (node.parent.parent.name.type === "JSXMemberExpression" &&
                            node.parent.parent.name.property.name === "Provider"))) {
                }
                else if (node.parent?.type === "JSXAttribute" &&
                    node.parent.name?.type === "JSXIdentifier" &&
                    /^static[A-Z]/.test(node.parent.name.name) &&
                    node.parent.parent?.type === "JSXOpeningElement" &&
                    node.parent.parent.name.type === "JSXIdentifier" &&
                    !(0, utils_2.isDOMElementName)(node.parent.parent.name.name)) {
                }
                else if (node.parent?.type === "JSXAttribute" &&
                    node.parent.name.name === "ref" &&
                    (0, utils_2.isFunctionNode)(node.expression)) {
                    pushTrackedScope(node.expression, "called-function");
                }
                else if (node.parent?.type === "JSXElement" && (0, utils_2.isFunctionNode)(node.expression)) {
                    pushTrackedScope(node.expression, "function");
                }
                else {
                    pushTrackedScope(node.expression, "expression");
                }
            }
            else if (node.type === "JSXSpreadAttribute") {
                pushTrackedScope(node.argument, "expression");
            }
            else if (node.type === "NewExpression") {
                const { callee, arguments: { 0: arg0 }, } = node;
                if (callee.type === "Identifier" &&
                    arg0 &&
                    [
                        "IntersectionObserver",
                        "MutationObserver",
                        "PerformanceObserver",
                        "ReportingObserver",
                        "ResizeObserver",
                    ].includes(callee.name)) {
                    pushTrackedScope(arg0, "called-function");
                }
            }
            else if (node.type === "CallExpression") {
                if (node.callee.type === "Identifier") {
                    const { callee, arguments: { 0: arg0, 1: arg1 }, } = node;
                    if (matchImport([
                        "createMemo",
                        "children",
                        "createEffect",
                        "createRenderEffect",
                        "createDeferred",
                        "createComputed",
                        "createSelector",
                        "untrack",
                        "mapArray",
                        "indexArray",
                        "observable",
                    ], callee.name) ||
                        (matchImport("createResource", callee.name) && node.arguments.length >= 2)) {
                        pushTrackedScope(arg0, "function");
                    }
                    else if (matchImport(["onMount", "onCleanup", "onError"], callee.name) ||
                        [
                            "setInterval",
                            "setTimeout",
                            "setImmediate",
                            "requestAnimationFrame",
                            "requestIdleCallback",
                        ].includes(callee.name)) {
                        pushTrackedScope(arg0, "called-function");
                    }
                    else if (matchImport("on", callee.name)) {
                        if (arg0) {
                            if (arg0.type === "ArrayExpression") {
                                arg0.elements.forEach((element) => {
                                    if (element && element?.type !== "SpreadElement") {
                                        pushTrackedScope(element, "function");
                                    }
                                });
                            }
                            else {
                                pushTrackedScope(arg0, "function");
                            }
                        }
                        if (arg1) {
                            pushTrackedScope(arg1, "called-function");
                        }
                    }
                    else if (matchImport("createStore", callee.name) && arg0?.type === "ObjectExpression") {
                        for (const property of arg0.properties) {
                            if (property.type === "Property" &&
                                property.kind === "get" &&
                                (0, utils_2.isFunctionNode)(property.value)) {
                                pushTrackedScope(property.value, "function");
                            }
                        }
                    }
                    else if (matchImport("runWithOwner", callee.name)) {
                        if (arg1) {
                            let isTrackedScope = true;
                            const owner = arg0.type === "Identifier" && findVariable(context.getScope(), arg0);
                            if (owner) {
                                const decl = owner.defs[0];
                                if (decl &&
                                    decl.node.type === "VariableDeclarator" &&
                                    decl.node.init?.type === "CallExpression" &&
                                    decl.node.init.callee.type === "Identifier" &&
                                    matchImport("getOwner", decl.node.init.callee.name)) {
                                    const ownerFunction = (0, utils_2.findParent)(decl.node, utils_2.isProgramOrFunctionNode);
                                    const scopeStackIndex = scopeStack.findIndex(({ node }) => ownerFunction === node);
                                    if ((scopeStackIndex >= 1 &&
                                        !scopeStack[scopeStackIndex - 1].trackedScopes.some((trackedScope) => trackedScope.expect === "function" && trackedScope.node === ownerFunction)) ||
                                        scopeStackIndex === 0) {
                                        isTrackedScope = false;
                                    }
                                }
                            }
                            if (isTrackedScope) {
                                pushTrackedScope(arg1, "function");
                            }
                        }
                    }
                    else if (/^(?:use|create)[A-Z]/.test(callee.name)) {
                        for (const arg of node.arguments) {
                            if ((0, utils_2.isFunctionNode)(arg)) {
                                pushTrackedScope(arg, "called-function");
                            }
                            else if (arg.type === "Identifier" ||
                                arg.type === "ObjectExpression" ||
                                arg.type === "ArrayExpression") {
                                pushTrackedScope(arg, "expression");
                            }
                        }
                    }
                }
                else if (node.callee.type === "MemberExpression") {
                    const { property } = node.callee;
                    if (property.type === "Identifier" &&
                        property.name === "addEventListener" &&
                        node.arguments.length >= 2) {
                        pushTrackedScope(node.arguments[1], "called-function");
                    }
                    else if (property.type === "Identifier" && /^(?:use|create)[A-Z]/.test(property.name)) {
                        for (const arg of node.arguments) {
                            if ((0, utils_2.isFunctionNode)(arg)) {
                                pushTrackedScope(arg, "called-function");
                            }
                            else if (arg.type === "Identifier" ||
                                arg.type === "ObjectExpression" ||
                                arg.type === "ArrayExpression") {
                                pushTrackedScope(arg, "expression");
                            }
                        }
                    }
                }
            }
            else if (node.type === "VariableDeclarator") {
                if (node.init?.type === "CallExpression" && node.init.callee.type === "Identifier") {
                    if (matchImport(["createReactive", "createReaction"], node.init.callee.name)) {
                        const track = getReturnedVar(node.id, context.getScope());
                        if (track) {
                            for (const reference of track.references) {
                                if (!reference.init &&
                                    reference.isReadOnly() &&
                                    reference.identifier.parent?.type === "CallExpression" &&
                                    reference.identifier.parent.callee === reference.identifier) {
                                    const arg0 = reference.identifier.parent.arguments[0];
                                    arg0 && pushTrackedScope(arg0, "function");
                                }
                            }
                        }
                        if ((0, utils_2.isFunctionNode)(node.init.arguments[0])) {
                            pushTrackedScope(node.init.arguments[0], "called-function");
                        }
                    }
                }
            }
            else if (node.type === "AssignmentExpression") {
                if (node.left.type === "MemberExpression" &&
                    node.left.property.type === "Identifier" &&
                    (0, utils_2.isFunctionNode)(node.right) &&
                    /^on[a-z]+$/.test(node.left.property.name)) {
                    pushTrackedScope(node.right, "called-function");
                }
            }
            else if (node.type === "TaggedTemplateExpression") {
                for (const expression of node.quasi.expressions) {
                    if ((0, utils_2.isFunctionNode)(expression)) {
                        pushTrackedScope(expression, "called-function");
                        for (const param of expression.params) {
                            if (param.type === "Identifier" && (0, utils_2.isPropsByName)(param.name)) {
                                const variable = findVariable(context.getScope(), param);
                                if (variable)
                                    scopeStack.pushProps(variable, currentScope().node);
                            }
                        }
                    }
                }
            }
        };
        return {
            ImportDeclaration: handleImportDeclaration,
            JSXExpressionContainer(node) {
                checkForTrackedScopes(node);
            },
            JSXSpreadAttribute(node) {
                checkForTrackedScopes(node);
            },
            CallExpression(node) {
                checkForTrackedScopes(node);
                checkForSyncCallbacks(node);
                const parent = node.parent && (0, utils_2.ignoreTransparentWrappers)(node.parent, true);
                if (parent?.type !== "AssignmentExpression" && parent?.type !== "VariableDeclarator") {
                    checkForReactiveAssignment(null, node);
                }
            },
            NewExpression(node) {
                checkForTrackedScopes(node);
            },
            VariableDeclarator(node) {
                if (node.init) {
                    checkForReactiveAssignment(node.id, node.init);
                    checkForTrackedScopes(node);
                }
            },
            AssignmentExpression(node) {
                if (node.left.type !== "MemberExpression") {
                    checkForReactiveAssignment(node.left, node.right);
                }
                checkForTrackedScopes(node);
            },
            TaggedTemplateExpression(node) {
                checkForTrackedScopes(node);
            },
            "JSXElement > JSXExpressionContainer > :function"(node) {
                if ((0, utils_2.isFunctionNode)(node) &&
                    node.parent?.type === "JSXExpressionContainer" &&
                    node.parent.parent?.type === "JSXElement") {
                    const element = node.parent.parent;
                    if (element.openingElement.name.type === "JSXIdentifier") {
                        const tagName = element.openingElement.name.name;
                        if (matchImport("For", tagName) &&
                            node.params.length === 2 &&
                            node.params[1].type === "Identifier") {
                            const index = findVariable(context.getScope(), node.params[1]);
                            if (index) {
                                scopeStack.pushSignal(index, currentScope().node);
                            }
                        }
                        else if (matchImport("Index", tagName) &&
                            node.params.length >= 1 &&
                            node.params[0].type === "Identifier") {
                            const item = findVariable(context.getScope(), node.params[0]);
                            if (item) {
                                scopeStack.pushSignal(item, currentScope().node);
                            }
                        }
                    }
                }
            },
            FunctionExpression: onFunctionEnter,
            ArrowFunctionExpression: onFunctionEnter,
            FunctionDeclaration: onFunctionEnter,
            Program: onFunctionEnter,
            "FunctionExpression:exit": onFunctionExit,
            "ArrowFunctionExpression:exit": onFunctionExit,
            "FunctionDeclaration:exit": onFunctionExit,
            "Program:exit": onFunctionExit,
            JSXElement() {
                if (scopeStack.length) {
                    currentScope().hasJSX = true;
                }
            },
            JSXFragment() {
                if (scopeStack.length) {
                    currentScope().hasJSX = true;
                }
            },
        };
    },
});
