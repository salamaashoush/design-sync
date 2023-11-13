export function getNodeIndexPath(node) {
    const parentNode = node.parent;
    if (parentNode === null) {
        throw new Error('`parentNode` is `null`');
    }
    const nodeIndex = parentNode.children.findIndex(function (childNode) {
        return childNode.id === node.id;
    });
    if (nodeIndex === -1 || parentNode.type === 'DOCUMENT') {
        throw new Error('Invariant violation');
    }
    if (parentNode.type === 'PAGE') {
        const pageIndex = figma.root.children.findIndex(function (pageNode) {
            return pageNode.id === parentNode.id;
        });
        if (pageIndex === -1) {
            throw new Error('Invariant violation');
        }
        return [pageIndex, nodeIndex];
    }
    return [...getNodeIndexPath(parentNode), nodeIndex];
}
//# sourceMappingURL=get-node-index-path.js.map