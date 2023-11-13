import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { SelectableItem } from '../selectable-item.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['1'],
    title: 'Components/Selectable Item/Unselected'
};
export const Passive = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SelectableItem, { onChange: handleChange, value: value }, "Text"));
};
export const Focused = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SelectableItem, { ...useInitialFocus(), onChange: handleChange, value: value }, "Text"));
};
export const Disabled = function () {
    function handleChange() {
        throw new Error('This function should not be called');
    }
    return (h(SelectableItem, { disabled: true, onChange: handleChange, value: false }, "Text"));
};
export const Bold = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SelectableItem, { bold: true, onChange: handleChange, value: value }, "Text"));
};
export const Indent = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SelectableItem, { indent: true, onChange: handleChange, value: value }, "Text"));
};
export const OnValueChange = function () {
    const [value, setValue] = useState(false);
    function handleValueChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SelectableItem, { onValueChange: handleValueChange, value: value }, "Text"));
};
//# sourceMappingURL=selectable-item-unselected.stories.js.map