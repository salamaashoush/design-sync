const DEFAULT_KEY = 'documentUseCount';
export function getDocumentUseCount(key = DEFAULT_KEY) {
    const value = figma.root.getPluginData(key);
    if (value === '') {
        return 0;
    }
    const pluginData = JSON.parse(value);
    return pluginData.useCount;
}
export function incrementDocumentUseCount(key = DEFAULT_KEY) {
    const useCount = getDocumentUseCount(key);
    const pluginData = {
        useCount: useCount + 1
    };
    figma.root.setPluginData(key, JSON.stringify(pluginData));
    return pluginData.useCount;
}
export function resetDocumentUseCount(key = DEFAULT_KEY) {
    const pluginData = {
        useCount: 0
    };
    figma.root.setPluginData(key, JSON.stringify(pluginData));
}
//# sourceMappingURL=document-use-count.js.map