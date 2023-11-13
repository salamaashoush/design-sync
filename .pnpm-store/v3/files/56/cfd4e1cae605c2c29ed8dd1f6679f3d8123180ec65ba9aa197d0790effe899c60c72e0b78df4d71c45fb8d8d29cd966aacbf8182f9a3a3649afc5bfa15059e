import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconTextAlignCenter16 } from '../../../icons/icon-16/icon-text-align-center-16.js';
import { IconTextAlignLeft16 } from '../../../icons/icon-16/icon-text-align-left-16.js';
import { IconTextAlignRight16 } from '../../../icons/icon-16/icon-text-align-right-16.js';
import { SegmentedControl } from '../segmented-control.js';
export default { title: 'Components/Segmented Control' };
export const Passive = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SegmentedControl, { onChange: handleChange, options: options, value: value }));
};
export const Focused = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SegmentedControl, { ...useInitialFocus(), onChange: handleChange, options: options, value: value }));
};
export const Disabled = function () {
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' }
    ];
    function handleChange() {
        throw new Error('This function should not be called');
    }
    return (h(SegmentedControl, { disabled: true, onChange: handleChange, options: options, value: "bar" }));
};
export const DisabledOption = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { disabled: true, value: 'baz' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SegmentedControl, { onChange: handleChange, options: options, value: value }));
};
export const IconChildren = function () {
    const [value, setValue] = useState('align-left');
    const options = [
        { children: h(IconTextAlignLeft16, null), value: 'align-left' },
        { children: h(IconTextAlignCenter16, null), value: 'align-center' },
        { children: h(IconTextAlignRight16, null), value: 'align-right' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SegmentedControl, { onChange: handleChange, options: options, value: value }));
};
export const OnValueChange = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' }
    ];
    function handleValueChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SegmentedControl, { onValueChange: handleValueChange, options: options, value: value }));
};
//# sourceMappingURL=segmented-control.stories.js.map