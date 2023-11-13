import { getRelaunchButtonsData, setRelaunchButtonsData } from './private/update-relaunch-buttons-data.js';
export function unsetRelaunchButton(node, relaunchButtonId) {
    if (typeof relaunchButtonId === 'undefined') {
        setRelaunchButtonsData(node, {});
        node.setRelaunchData({});
        return;
    }
    const relaunchButtonsData = getRelaunchButtonsData(node);
    if (typeof relaunchButtonsData[relaunchButtonId] !== 'undefined') {
        delete relaunchButtonsData[relaunchButtonId];
    }
    setRelaunchButtonsData(node, relaunchButtonsData);
    node.setRelaunchData(relaunchButtonsData);
}
//# sourceMappingURL=unset-relaunch-button.js.map