import { traverseNode } from './traverse-node.js';
export function collapseLayer(node) {
    let didChange = false;
    traverseNode(node, function (node) {
        if ('expanded' in node && node.expanded === true) {
            node.expanded = false;
            didChange = true;
        }
    });
    return didChange;
}
//# sourceMappingURL=collapse-layer.js.map