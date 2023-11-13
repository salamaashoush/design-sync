const RELAUNCH_BUTTONS_PLUGIN_DATA_KEY = 'relaunchButtons';
export function getRelaunchButtonsData(node) {
    const pluginData = node.getPluginData(RELAUNCH_BUTTONS_PLUGIN_DATA_KEY);
    if (pluginData === '') {
        return {};
    }
    return JSON.parse(pluginData);
}
export function setRelaunchButtonsData(node, relaunchButtonsData) {
    if (Object.keys(relaunchButtonsData).length === 0) {
        node.setPluginData(RELAUNCH_BUTTONS_PLUGIN_DATA_KEY, '');
        return;
    }
    node.setPluginData(RELAUNCH_BUTTONS_PLUGIN_DATA_KEY, JSON.stringify(relaunchButtonsData));
}
//# sourceMappingURL=update-relaunch-buttons-data.js.map