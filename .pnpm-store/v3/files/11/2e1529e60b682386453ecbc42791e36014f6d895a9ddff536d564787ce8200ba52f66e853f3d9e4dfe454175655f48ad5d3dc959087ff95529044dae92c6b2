export function extractAttributes(array, attributes) {
    const result = [];
    for (const object of array) {
        result.push(pick(object, attributes));
    }
    return result;
}
function pick(object, keys) {
    const result = {};
    for (const key of keys) {
        const value = object[key];
        if (typeof value === 'undefined') {
            throw new Error(`Key \`${String(key)}\` does not exist on \`object\``);
        }
        result[key] = value;
    }
    return result;
}
//# sourceMappingURL=extract-attributes.js.map