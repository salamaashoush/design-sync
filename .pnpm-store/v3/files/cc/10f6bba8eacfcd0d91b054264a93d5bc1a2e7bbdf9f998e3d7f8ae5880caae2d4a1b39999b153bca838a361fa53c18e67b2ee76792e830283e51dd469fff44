import { traverseNode } from '../traverse-node.js';
export function getDocumentComponents() {
    const result = [];
    for (const page of figma.root.children) {
        for (const node of page.children) {
            traverseNode(node, function (node) {
                if (node.type === 'COMPONENT') {
                    result.push(node);
                }
            }, function (node) {
                return node.type === 'COMPONENT';
            });
        }
    }
    return result;
}
//# sourceMappingURL=get-document-components.js.map