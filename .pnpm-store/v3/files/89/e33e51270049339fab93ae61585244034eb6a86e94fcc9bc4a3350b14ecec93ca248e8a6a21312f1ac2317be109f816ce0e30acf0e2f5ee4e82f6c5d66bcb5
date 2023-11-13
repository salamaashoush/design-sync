export function isLocked(node) {
    if (node.locked === true) {
        return true;
    }
    if (node.parent === null || node.parent.type === 'PAGE') {
        return false;
    }
    return isLocked(node.parent);
}
//# sourceMappingURL=is-locked.js.map