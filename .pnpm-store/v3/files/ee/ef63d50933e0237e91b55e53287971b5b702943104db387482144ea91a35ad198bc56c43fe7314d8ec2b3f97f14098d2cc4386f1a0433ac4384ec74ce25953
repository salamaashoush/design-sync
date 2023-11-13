import naturalCompare from 'natural-compare-lite';
export function sortNodesByName(nodes) {
    if (nodes.length < 2) {
        return nodes.slice();
    }
    return nodes.slice().sort(function (a, b) {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName !== bName) {
            return naturalCompare(bName, aName);
        }
        const y = b.y - a.y;
        if (y !== 0) {
            return y;
        }
        const x = b.x - a.x;
        if (x !== 0) {
            return x;
        }
        return naturalCompare(b.id, a.id);
    });
}
//# sourceMappingURL=sort-nodes-by-name.js.map