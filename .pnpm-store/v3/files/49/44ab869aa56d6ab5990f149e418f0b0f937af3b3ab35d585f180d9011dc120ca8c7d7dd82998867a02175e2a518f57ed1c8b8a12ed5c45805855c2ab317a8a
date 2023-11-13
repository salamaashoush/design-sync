"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSpecifier = exports.insertImports = exports.appendImports = exports.trackImports = exports.getCommentAfter = exports.getCommentBefore = exports.findInScope = exports.isProgramOrFunctionNode = exports.isFunctionNode = exports.ignoreTransparentWrappers = exports.trace = exports.findParent = exports.find = exports.formatList = exports.isPropsByName = exports.isDOMElementName = void 0;
const utils_1 = require("@typescript-eslint/utils");
const { findVariable } = utils_1.ASTUtils;
const domElementRegex = /^[a-z]/;
const isDOMElementName = (name) => domElementRegex.test(name);
exports.isDOMElementName = isDOMElementName;
const propsRegex = /[pP]rops/;
const isPropsByName = (name) => propsRegex.test(name);
exports.isPropsByName = isPropsByName;
const formatList = (strings) => {
    if (strings.length === 0) {
        return "";
    }
    else if (strings.length === 1) {
        return `'${strings[0]}'`;
    }
    else if (strings.length === 2) {
        return `'${strings[0]}' and '${strings[1]}'`;
    }
    else {
        const last = strings.length - 1;
        return `${strings
            .slice(0, last)
            .map((s) => `'${s}'`)
            .join(", ")}, and '${strings[last]}'`;
    }
};
exports.formatList = formatList;
const find = (node, predicate) => {
    let n = node;
    while (n) {
        const result = predicate(n);
        if (result) {
            return n;
        }
        n = n.parent;
    }
    return null;
};
exports.find = find;
function findParent(node, predicate) {
    return node.parent ? (0, exports.find)(node.parent, predicate) : null;
}
exports.findParent = findParent;
function trace(node, initialScope) {
    if (node.type === "Identifier") {
        const variable = findVariable(initialScope, node);
        if (!variable)
            return node;
        const def = variable.defs[0];
        switch (def.type) {
            case "FunctionName":
            case "ClassName":
            case "ImportBinding":
                return def.node;
            case "Variable":
                if ((def.node.parent.kind === "const" ||
                    variable.references.every((ref) => ref.init || ref.isReadOnly())) &&
                    def.node.id.type === "Identifier" &&
                    def.node.init) {
                    return trace(def.node.init, initialScope);
                }
        }
    }
    return node;
}
exports.trace = trace;
function ignoreTransparentWrappers(node, up = false) {
    if (node.type === "TSAsExpression" ||
        node.type === "TSNonNullExpression" ||
        node.type === "TSSatisfiesExpression") {
        const next = up ? node.parent : node.expression;
        if (next) {
            return ignoreTransparentWrappers(next, up);
        }
    }
    return node;
}
exports.ignoreTransparentWrappers = ignoreTransparentWrappers;
const FUNCTION_TYPES = ["FunctionExpression", "ArrowFunctionExpression", "FunctionDeclaration"];
const isFunctionNode = (node) => !!node && FUNCTION_TYPES.includes(node.type);
exports.isFunctionNode = isFunctionNode;
const PROGRAM_OR_FUNCTION_TYPES = ["Program"].concat(FUNCTION_TYPES);
const isProgramOrFunctionNode = (node) => !!node && PROGRAM_OR_FUNCTION_TYPES.includes(node.type);
exports.isProgramOrFunctionNode = isProgramOrFunctionNode;
function findInScope(node, scope, predicate) {
    const found = (0, exports.find)(node, (node) => node === scope || predicate(node));
    return found === scope && !predicate(node) ? null : found;
}
exports.findInScope = findInScope;
const getCommentBefore = (node, sourceCode) => sourceCode
    .getCommentsBefore(node)
    .find((comment) => comment.loc.end.line >= node.loc.start.line - 1);
exports.getCommentBefore = getCommentBefore;
const getCommentAfter = (node, sourceCode) => sourceCode
    .getCommentsAfter(node)
    .find((comment) => comment.loc.start.line === node.loc.end.line);
exports.getCommentAfter = getCommentAfter;
const trackImports = (fromModule = /^solid-js(?:\/?|\b)/) => {
    const importMap = new Map();
    const handleImportDeclaration = (node) => {
        if (fromModule.test(node.source.value)) {
            for (const specifier of node.specifiers) {
                if (specifier.type === "ImportSpecifier") {
                    importMap.set(specifier.imported.name, specifier.local.name);
                }
            }
        }
    };
    const matchImport = (imports, str) => {
        const importArr = Array.isArray(imports) ? imports : [imports];
        return importArr.find((i) => importMap.get(i) === str);
    };
    return { matchImport, handleImportDeclaration };
};
exports.trackImports = trackImports;
function appendImports(fixer, sourceCode, importNode, identifiers) {
    const identifiersString = identifiers.join(", ");
    const reversedSpecifiers = importNode.specifiers.slice().reverse();
    const lastSpecifier = reversedSpecifiers.find((s) => s.type === "ImportSpecifier");
    if (lastSpecifier) {
        return fixer.insertTextAfter(lastSpecifier, `, ${identifiersString}`);
    }
    const otherSpecifier = importNode.specifiers.find((s) => s.type === "ImportDefaultSpecifier" || s.type === "ImportNamespaceSpecifier");
    if (otherSpecifier) {
        return fixer.insertTextAfter(otherSpecifier, `, { ${identifiersString} }`);
    }
    if (importNode.specifiers.length === 0) {
        const [importToken, maybeBrace] = sourceCode.getFirstTokens(importNode, { count: 2 });
        if (maybeBrace?.value === "{") {
            return fixer.insertTextAfter(maybeBrace, ` ${identifiersString} `);
        }
        else {
            return importToken
                ? fixer.insertTextAfter(importToken, ` { ${identifiersString} } from`)
                : null;
        }
    }
    return null;
}
exports.appendImports = appendImports;
function insertImports(fixer, sourceCode, source, identifiers, aboveImport, isType = false) {
    const identifiersString = identifiers.join(", ");
    const programNode = sourceCode.ast;
    const firstImport = aboveImport ?? programNode.body.find((n) => n.type === "ImportDeclaration");
    if (firstImport) {
        return fixer.insertTextBeforeRange(((0, exports.getCommentBefore)(firstImport, sourceCode) ?? firstImport).range, `import ${isType ? "type " : ""}{ ${identifiersString} } from "${source}";\n`);
    }
    return fixer.insertTextBeforeRange([0, 0], `import ${isType ? "type " : ""}{ ${identifiersString} } from "${source}";\n`);
}
exports.insertImports = insertImports;
function removeSpecifier(fixer, sourceCode, specifier, pure = true) {
    const declaration = specifier.parent;
    if (declaration.specifiers.length === 1 && pure) {
        return fixer.remove(declaration);
    }
    const maybeComma = sourceCode.getTokenAfter(specifier);
    if (maybeComma?.value === ",") {
        return fixer.removeRange([specifier.range[0], maybeComma.range[1]]);
    }
    return fixer.remove(specifier);
}
exports.removeSpecifier = removeSpecifier;
