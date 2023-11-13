export function traverseNode(node, processNode, stopTraversal) {
    if (node.removed === true) {
        return;
    }
    if ('children' in node &&
        (typeof stopTraversal !== 'function' || stopTraversal(node) === false)) {
        for (const childNode of node.children) {
            traverseNode(childNode, processNode, stopTraversal);
        }
    }
    processNode(node);
}
//# sourceMappingURL=traverse-node.js.map