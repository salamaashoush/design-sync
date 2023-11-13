export function getSceneNodeById(id) {
    const node = figma.getNodeById(id);
    if (node === null) {
        throw new Error(`No node found with \`id\`: ${id}`);
    }
    if (node.type === 'DOCUMENT' || node.type === 'PAGE') {
        throw new Error('`node` is not a `SceneNode`');
    }
    return node;
}
//# sourceMappingURL=get-scene-node-by-id.js.map