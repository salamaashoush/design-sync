import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { Text } from '../../text/text.js';
import { RadioButtons } from '../radio-buttons.js';
export default {
    title: 'Components/Radio Buttons'
};
export const Passive = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { children: h(Text, null, "foo"), value: 'foo' },
        { children: h(Text, null, "bar"), value: 'bar' },
        { children: h(Text, null, "baz"), value: 'baz' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(RadioButtons, { onChange: handleChange, options: options, value: value }));
};
export const Focused = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { children: h(Text, null, "foo"), value: 'foo' },
        { children: h(Text, null, "bar"), value: 'bar' },
        { children: h(Text, null, "baz"), value: 'baz' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(RadioButtons, { ...useInitialFocus(), onChange: handleChange, options: options, value: value }));
};
export const Disabled = function () {
    const options = [
        { children: h(Text, null, "foo"), value: 'foo' },
        { children: h(Text, null, "bar"), value: 'bar' },
        { children: h(Text, null, "baz"), value: 'baz' }
    ];
    function handleChange() {
        throw new Error('This function should not be called');
    }
    return (h(RadioButtons, { disabled: true, onChange: handleChange, options: options, value: "bar" }));
};
export const DisabledOption = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { children: h(Text, null, "foo"), value: 'foo' },
        { children: h(Text, null, "bar"), value: 'bar' },
        { children: h(Text, null, "baz"), disabled: true, value: 'baz' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(RadioButtons, { onChange: handleChange, options: options, value: value }));
};
export const Space = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { children: h(Text, null, "foo"), value: 'foo' },
        { children: h(Text, null, "bar"), value: 'bar' },
        { children: h(Text, null, "baz"), value: 'baz' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(RadioButtons, { onChange: handleChange, options: options, space: "large", value: value }));
};
export const OnValueChange = function () {
    const [value, setValue] = useState('bar');
    const options = [
        { children: h(Text, null, "foo"), value: 'foo' },
        { children: h(Text, null, "bar"), value: 'bar' },
        { children: h(Text, null, "baz"), value: 'baz' }
    ];
    function handleChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(RadioButtons, { onValueChange: handleChange, options: options, value: value }));
};
//# sourceMappingURL=radio-buttons.stories.js.map