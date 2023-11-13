import { blue, green, red } from 'kleur/colors';
const ESC = '\u001B[';
function clearPreviousLine() {
    if (process.stdout.isTTY === false) {
        return;
    }
    process.stdout.write(`${ESC}F`);
    process.stdout.write(`${ESC}K`);
}
function clearViewport() {
    if (process.stdout.isTTY === false) {
        return;
    }
    console.clear();
}
function error(message, option) {
    if (typeof option !== 'undefined' && option.clearPreviousLine === true) {
        clearPreviousLine();
    }
    console.error(`${red('error')} ${message}`);
}
function info(message, option) {
    if (typeof option !== 'undefined' && option.clearPreviousLine === true) {
        clearPreviousLine();
    }
    console.info(`${blue('info')} ${message}`);
}
function success(message, option) {
    if (typeof option !== 'undefined' && option.clearPreviousLine === true) {
        clearPreviousLine();
    }
    console.log(`${green('success')} ${message}`);
}
export const log = {
    clearViewport,
    error,
    info,
    success
};
//# sourceMappingURL=log.js.map