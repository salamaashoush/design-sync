export function filterTypeScriptDiagnostics(diagnostics) {
    return diagnostics.filter(function (diagnostic) {
        if (typeof diagnostic.file === 'undefined') {
            return true;
        }
        const fileName = diagnostic.file.fileName;
        if (fileName.indexOf('typescript/lib/lib.dom.d.ts') === -1 &&
            fileName.indexOf('@figma/plugin-typings/index.d.ts') === -1 &&
            fileName.indexOf('@types/node/globals.d.ts') === -1 &&
            fileName.indexOf('@types/node/ts4.8/globals.d.ts') === -1) {
            return true;
        }
        const { code, messageText } = diagnostic;
        if (code === 2451 &&
            messageText !== "Cannot redeclare block-scoped variable 'console'." &&
            messageText !== "Cannot redeclare block-scoped variable 'fetch'.") {
            return true;
        }
        if (code === 2649 &&
            messageText !==
                "Cannot augment module 'console' with value exports because it resolves to a non-module entity.") {
            return true;
        }
        return false;
    });
}
//# sourceMappingURL=filter-typescript-diagnostics.js.map