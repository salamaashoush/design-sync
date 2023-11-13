import { getParentNode } from '../get-nodes/get-parent-node.js';
import { areSiblingNodes } from '../sibling-nodes/are-sibling-nodes.js';
export function sortNodesByCanonicalOrder(siblingNodes) {
    if (siblingNodes.length < 2) {
        return siblingNodes.slice();
    }
    const parentNode = getParentNode(siblingNodes[0]);
    if (areSiblingNodes(siblingNodes) === false) {
        throw new Error('Nodes in `siblingNodes` do not have the same parent');
    }
    return siblingNodes
        .slice()
        .map(function (node) {
        return {
            index: parentNode.children.indexOf(node),
            node
        };
    })
        .sort(function (a, b) {
        return a.index - b.index;
    })
        .map(function ({ node }) {
        return node;
    });
}
//# sourceMappingURL=sort-nodes-by-canonical-order.js.map