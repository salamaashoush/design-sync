export function cloneObject(object) {
    if (object === null ||
        typeof object === 'undefined' ||
        typeof object === 'boolean' ||
        typeof object === 'number' ||
        typeof object === 'string') {
        return object;
    }
    if (Array.isArray(object)) {
        const result = [];
        for (const value of object) {
            result.push(cloneObject(value));
        }
        return result;
    }
    const result = {};
    for (const key in object) {
        result[key] = cloneObject(object[key]);
    }
    return result;
}
//# sourceMappingURL=clone-object.js.map