import { compareStringArrays } from '../../object/compare-string-arrays.js';
import { getParentNode } from '../get-nodes/get-parent-node.js';
import { areSiblingNodes } from '../sibling-nodes/are-sibling-nodes.js';
export function updateNodesSortOrder(siblingNodes) {
    const parentNode = getParentNode(siblingNodes[0]);
    if (areSiblingNodes(siblingNodes) === false) {
        throw new Error('Nodes in `siblingNodes` do not have the same parent');
    }
    const siblingNodesCopy = siblingNodes.slice();
    const ids = parentNode.children.map(function ({ id }) {
        return id;
    });
    const insertIndex = computeInsertIndex(siblingNodesCopy, ids);
    for (const node of siblingNodesCopy) {
        parentNode.insertChild(insertIndex, node);
    }
    const idsAfter = parentNode.children.map(function ({ id }) {
        return id;
    });
    return compareStringArrays(ids, idsAfter) === false;
}
function computeInsertIndex(nodes, ids) {
    let insertIndex = -1;
    for (const node of nodes) {
        const index = ids.indexOf(node.id);
        if (index > insertIndex) {
            insertIndex = index;
        }
    }
    return insertIndex + 1;
}
//# sourceMappingURL=update-nodes-sort-order.js.map