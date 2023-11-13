export function isVisible(node) {
    if (node.visible === false) {
        return false;
    }
    if (node.parent === null || node.parent.type === 'PAGE') {
        return true;
    }
    return isVisible(node.parent);
}
//# sourceMappingURL=is-visible.js.map