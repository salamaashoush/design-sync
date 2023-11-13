const DEFAULT_KEY = 'totalUseCount';
export async function getTotalUseCountAsync(key = DEFAULT_KEY) {
    const useCount = await figma.clientStorage.getAsync(key);
    if (typeof useCount === 'undefined') {
        return 0;
    }
    return useCount;
}
export async function incrementTotalUseCountAsync(key = DEFAULT_KEY) {
    const useCount = await getTotalUseCountAsync(key);
    const newUseCount = useCount + 1;
    await figma.clientStorage.setAsync(key, newUseCount);
    return newUseCount;
}
export async function resetTotalUseCountAsync(key = DEFAULT_KEY) {
    await figma.clientStorage.setAsync(key, 0);
}
//# sourceMappingURL=total-use-count.js.map