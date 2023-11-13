import { getAbsolutePosition } from './absolute-position/get-absolute-position.js';
import { getParentNode } from './get-nodes/get-parent-node.js';
export function computeBoundingBox(node) {
    if ('rotation' in node && node.rotation === 0) {
        const absolutePosition = getAbsolutePosition(node);
        const { width, height } = node;
        return { ...absolutePosition, height, width };
    }
    const parentNode = getParentNode(node);
    const index = parentNode.children.indexOf(node);
    const group = figma.group([node], parentNode, index);
    const absolutePosition = getAbsolutePosition(group);
    const { width, height } = group;
    parentNode.insertChild(index, node);
    return { ...absolutePosition, height, width };
}
//# sourceMappingURL=compute-bounding-box.js.map