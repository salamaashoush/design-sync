import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { Text } from '../../text/text.js';
import { Checkbox } from '../checkbox.js';
export default {
    tags: ['1'],
    title: 'Components/Checkbox/Unselected'
};
export const Passive = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Checkbox, { onChange: handleChange, value: value },
        h(Text, null, "Text")));
};
export const Focused = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Checkbox, { ...useInitialFocus(), onChange: handleChange, value: value },
        h(Text, null, "Text")));
};
export const Disabled = function () {
    function handleChange() {
        throw new Error('This function should not be called');
    }
    return (h(Checkbox, { disabled: true, onChange: handleChange, value: false },
        h(Text, null, "Text")));
};
export const OnValueChange = function () {
    const [value, setValue] = useState(false);
    function handleValueChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Checkbox, { onValueChange: handleValueChange, value: value },
        h(Text, null, "Text")));
};
//# sourceMappingURL=checkbox-unselected.stories.js.map