import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconEllipsis32 } from '../../../icons/icon-32/icon-ellipsis-32.js';
import { IconToggleButton } from '../icon-toggle-button.js';
export default {
    tags: ['2'],
    title: 'Components/Icon Toggle Button/Selected'
};
export const Passive = function () {
    const [value, setValue] = useState(true);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(IconToggleButton, { onChange: handleChange, value: value },
        h(IconEllipsis32, null)));
};
export const Focused = function () {
    const [value, setValue] = useState(true);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(IconToggleButton, { ...useInitialFocus(), onChange: handleChange, value: value },
        h(IconEllipsis32, null)));
};
export const Disabled = function () {
    function handleChange() {
        throw new Error('This function should not be called');
    }
    return (h(IconToggleButton, { disabled: true, onChange: handleChange, value: true },
        h(IconEllipsis32, null)));
};
export const OnValueChange = function () {
    const [value, setValue] = useState(true);
    function handleValueChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(IconToggleButton, { onValueChange: handleValueChange, value: value },
        h(IconEllipsis32, null)));
};
//# sourceMappingURL=icon-toggle-button-selected.stories.js.map