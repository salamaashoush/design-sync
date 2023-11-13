export function compareObjects(a, b) {
    if (a === null ||
        typeof a === 'undefined' ||
        typeof a === 'boolean' ||
        typeof a === 'number' ||
        typeof a === 'string') {
        return a === b;
    }
    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (const index in a) {
            if (compareObjects(a[index], b[index]) === false) {
                return false;
            }
        }
        return true;
    }
    if (b === null ||
        typeof b === 'undefined' ||
        typeof b === 'boolean' ||
        typeof b === 'number' ||
        typeof b === 'string' ||
        Array.isArray(b)) {
        return false;
    }
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    for (const key in a) {
        if (compareObjects(a[key], b[key]) === false) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=compare-objects.js.map