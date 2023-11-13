const DEFAULT_SETTINGS_KEY = 'settings';
export async function loadSettingsAsync(defaultSettings, settingsKey = DEFAULT_SETTINGS_KEY) {
    const settings = await figma.clientStorage.getAsync(settingsKey);
    if (typeof settings === 'undefined') {
        return defaultSettings;
    }
    return Object.assign({}, defaultSettings, settings);
}
export async function saveSettingsAsync(settings, settingsKey = DEFAULT_SETTINGS_KEY) {
    await figma.clientStorage.setAsync(settingsKey, settings);
}
//# sourceMappingURL=settings.js.map