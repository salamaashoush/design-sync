export function getSelectedNodesOrAllNodes() {
    const selectedNodes = figma.currentPage.selection;
    if (selectedNodes.length > 0) {
        return selectedNodes.slice();
    }
    return figma.currentPage.children.slice();
}
//# sourceMappingURL=get-selected-nodes-or-all-nodes.js.map