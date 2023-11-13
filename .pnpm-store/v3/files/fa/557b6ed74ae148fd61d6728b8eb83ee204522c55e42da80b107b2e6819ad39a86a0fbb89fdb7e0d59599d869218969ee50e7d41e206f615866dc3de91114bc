export function deduplicateArray(array) {
    const object = {};
    const result = [];
    for (const value of array) {
        if (object[`${value}`] === true) {
            continue;
        }
        object[`${value}`] = true;
        result.push(value);
    }
    return result;
}
//# sourceMappingURL=deduplicate-array.js.map