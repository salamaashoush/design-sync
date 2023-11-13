export function setAbsolutePosition(node, vector) {
    if (typeof vector.x === 'undefined' && typeof vector.y === 'undefined') {
        throw new Error('Need at least one of `x` or `y`');
    }
    let x = typeof vector.x === 'undefined' ? null : vector.x;
    let y = typeof vector.y === 'undefined' ? null : vector.y;
    let parentNode = node.parent;
    while (parentNode !== null && parentNode.type !== 'PAGE') {
        if (parentNode.type === 'FRAME' || parentNode.type === 'SECTION') {
            if (x !== null) {
                x = x - parentNode.x;
            }
            if (y !== null) {
                y = y - parentNode.y;
            }
        }
        parentNode = parentNode.parent;
    }
    if (x !== null) {
        node.x = x;
    }
    if (y !== null) {
        node.y = y;
    }
}
//# sourceMappingURL=set-absolute-position.js.map