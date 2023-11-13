"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("../utils");
const createRule = utils_1.ESLintUtils.RuleCreator.withoutDocs;
const primitiveMap = new Map();
for (const primitive of [
    "createSignal",
    "createEffect",
    "createMemo",
    "createResource",
    "onMount",
    "onCleanup",
    "onError",
    "untrack",
    "batch",
    "on",
    "createRoot",
    "getOwner",
    "runWithOwner",
    "mergeProps",
    "splitProps",
    "useTransition",
    "observable",
    "from",
    "mapArray",
    "indexArray",
    "createContext",
    "useContext",
    "children",
    "lazy",
    "createUniqueId",
    "createDeferred",
    "createRenderEffect",
    "createComputed",
    "createReaction",
    "createSelector",
    "DEV",
    "For",
    "Show",
    "Switch",
    "Match",
    "Index",
    "ErrorBoundary",
    "Suspense",
    "SuspenseList",
]) {
    primitiveMap.set(primitive, "solid-js");
}
for (const primitive of [
    "Portal",
    "render",
    "hydrate",
    "renderToString",
    "renderToStream",
    "isServer",
    "renderToStringAsync",
    "generateHydrationScript",
    "HydrationScript",
    "Dynamic",
]) {
    primitiveMap.set(primitive, "solid-js/web");
}
for (const primitive of [
    "createStore",
    "produce",
    "reconcile",
    "unwrap",
    "createMutable",
    "modifyMutable",
]) {
    primitiveMap.set(primitive, "solid-js/store");
}
const typeMap = new Map();
for (const type of [
    "Signal",
    "Accessor",
    "Setter",
    "Resource",
    "ResourceActions",
    "ResourceOptions",
    "ResourceReturn",
    "ResourceFetcher",
    "InitializedResourceReturn",
    "Component",
    "VoidProps",
    "VoidComponent",
    "ParentProps",
    "ParentComponent",
    "FlowProps",
    "FlowComponent",
    "ValidComponent",
    "ComponentProps",
    "Ref",
    "MergeProps",
    "SplitPrips",
    "Context",
    "JSX",
    "ResolvedChildren",
    "MatchProps",
]) {
    typeMap.set(type, "solid-js");
}
for (const type of ["MountableElement"]) {
    typeMap.set(type, "solid-js/web");
}
for (const type of ["StoreNode", "Store", "SetStoreFunction"]) {
    typeMap.set(type, "solid-js/store");
}
const sourceRegex = /^solid-js(?:\/web|\/store)?$/;
const isSource = (source) => sourceRegex.test(source);
exports.default = createRule({
    meta: {
        type: "suggestion",
        docs: {
            description: 'Enforce consistent imports from "solid-js", "solid-js/web", and "solid-js/store".',
            url: "https://github.com/solidjs-community/eslint-plugin-solid/blob/main/docs/imports.md",
        },
        fixable: "code",
        schema: [],
        messages: {
            "prefer-source": 'Prefer importing {{name}} from "{{source}}".',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source.value;
                if (!isSource(source))
                    return;
                for (const specifier of node.specifiers) {
                    if (specifier.type === "ImportSpecifier") {
                        const isType = specifier.importKind === "type" || node.importKind === "type";
                        const map = isType ? typeMap : primitiveMap;
                        const correctSource = map.get(specifier.imported.name);
                        if (correctSource != null && correctSource !== source) {
                            context.report({
                                node: specifier,
                                messageId: "prefer-source",
                                data: {
                                    name: specifier.imported.name,
                                    source: correctSource,
                                },
                                fix(fixer) {
                                    const sourceCode = context.getSourceCode();
                                    const program = sourceCode.ast;
                                    const correctDeclaration = program.body.find((node) => node.type === "ImportDeclaration" && node.source.value === correctSource);
                                    if (correctDeclaration) {
                                        return [
                                            (0, utils_2.removeSpecifier)(fixer, sourceCode, specifier),
                                            (0, utils_2.appendImports)(fixer, sourceCode, correctDeclaration, [
                                                sourceCode.getText(specifier),
                                            ]),
                                        ].filter(Boolean);
                                    }
                                    const firstSolidDeclaration = program.body.find((node) => node.type === "ImportDeclaration" && isSource(node.source.value));
                                    return [
                                        (0, utils_2.removeSpecifier)(fixer, sourceCode, specifier),
                                        (0, utils_2.insertImports)(fixer, sourceCode, correctSource, [sourceCode.getText(specifier)], firstSolidDeclaration, isType),
                                    ];
                                },
                            });
                        }
                    }
                }
            },
        };
    },
});
