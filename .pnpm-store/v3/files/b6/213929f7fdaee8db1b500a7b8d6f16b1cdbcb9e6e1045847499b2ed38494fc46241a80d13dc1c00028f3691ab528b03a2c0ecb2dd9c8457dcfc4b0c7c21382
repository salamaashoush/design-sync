import { getParentNode } from '../get-nodes/get-parent-node.js';
export function computeSiblingNodes(nodes) {
    const groups = resolveGroups(nodes);
    const result = [];
    for (const group of groups) {
        const parentNode = getParentNode(group[0]);
        const siblingNodes = group
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
        result.push(siblingNodes);
    }
    return result;
}
function resolveGroups(nodes) {
    const result = {};
    for (const node of nodes) {
        const parentNode = getParentNode(node);
        const parentId = parentNode.id;
        if (parentId in result === false) {
            result[parentId] = [];
        }
        result[parentId].push(node);
    }
    return Object.values(result);
}
//# sourceMappingURL=compute-sibling-nodes.js.map