import { getRelaunchButtonsData, setRelaunchButtonsData } from './private/update-relaunch-buttons-data.js';
export function setRelaunchButton(node, relaunchButtonId, options = { description: '' }) {
    const relaunchButtonsData = {
        ...getRelaunchButtonsData(node),
        [relaunchButtonId]: options.description
    };
    setRelaunchButtonsData(node, relaunchButtonsData);
    node.setRelaunchData(relaunchButtonsData);
}
//# sourceMappingURL=set-relaunch-button.js.map