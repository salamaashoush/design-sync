import { h } from 'preact';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconPlus32 } from '../../../icons/icon-32/icon-plus-32.js';
import { IconButton } from '../icon-button.js';
export default {
    title: 'Components/Icon Button'
};
export const Passive = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(IconButton, { onClick: handleClick },
        h(IconPlus32, null)));
};
export const Focused = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(IconButton, { ...useInitialFocus(), onClick: handleClick },
        h(IconPlus32, null)));
};
export const Disabled = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(IconButton, { disabled: true, onClick: handleClick },
        h(IconPlus32, null)));
};
//# sourceMappingURL=icon-button.stories.js.map