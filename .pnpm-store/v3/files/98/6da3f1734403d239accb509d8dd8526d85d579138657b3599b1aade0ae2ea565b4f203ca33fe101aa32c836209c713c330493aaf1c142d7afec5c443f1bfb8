import { getParentNode } from '../get-nodes/get-parent-node.js';
export function areSiblingNodes(nodes) {
    if (nodes.length < 2) {
        return true;
    }
    const [firstNode, ...rest] = nodes;
    const firstParentNode = getParentNode(firstNode);
    for (const node of rest) {
        if (node.parent === null || node.parent.id !== firstParentNode.id) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=are-sibling-nodes.js.map