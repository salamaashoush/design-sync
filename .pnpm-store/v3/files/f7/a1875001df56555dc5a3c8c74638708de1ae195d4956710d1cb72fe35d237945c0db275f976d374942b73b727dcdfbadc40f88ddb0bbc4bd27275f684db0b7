export function isWithinInstanceNode(node) {
    const parentNode = node.parent;
    if (parentNode === null ||
        parentNode.type === 'DOCUMENT' ||
        parentNode.type === 'PAGE') {
        return false;
    }
    if (parentNode.type === 'INSTANCE') {
        return true;
    }
    return isWithinInstanceNode(parentNode);
}
//# sourceMappingURL=is-within-instance-node.js.map