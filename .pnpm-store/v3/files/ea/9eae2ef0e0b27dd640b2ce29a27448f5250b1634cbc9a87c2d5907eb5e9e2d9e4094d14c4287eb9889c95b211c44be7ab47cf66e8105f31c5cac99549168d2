export async function traverseNodeAsync(node, processNodeAsync, stopTraversalAsync) {
    if (node.removed === true) {
        return;
    }
    if ('children' in node &&
        (typeof stopTraversalAsync !== 'function' ||
            (await stopTraversalAsync(node)) === false)) {
        for (const childNode of node.children) {
            await traverseNodeAsync(childNode, processNodeAsync, stopTraversalAsync);
        }
    }
    await processNodeAsync(node);
}
//# sourceMappingURL=traverse-node-async.js.map