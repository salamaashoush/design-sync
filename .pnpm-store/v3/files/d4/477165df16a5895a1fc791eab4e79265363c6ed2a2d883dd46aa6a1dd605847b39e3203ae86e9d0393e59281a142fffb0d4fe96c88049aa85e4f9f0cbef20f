import indentString from 'indent-string';
import ts from 'typescript';
const formatDiagnosticsHost = {
    getCanonicalFileName: function (fileName) {
        return fileName;
    },
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: function () {
        return ts.sys.newLine;
    }
};
export function formatTypeScriptErrorMessage(diagnostics) {
    const string = ts.formatDiagnosticsWithColorAndContext(diagnostics, formatDiagnosticsHost);
    return `TypeScript error\n\n${indentString(string, 4)}`;
}
//# sourceMappingURL=format-typescript-error-message.js.map