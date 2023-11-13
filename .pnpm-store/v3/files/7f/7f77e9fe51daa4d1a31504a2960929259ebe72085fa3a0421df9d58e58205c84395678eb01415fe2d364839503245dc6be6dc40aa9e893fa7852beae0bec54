import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconLayerFrame16 } from '../../../../icons/icon-16/icon-layer-frame-16.js';
import { TextboxAutocomplete } from '../textbox-autocomplete.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['2'],
    title: 'Components/Textbox Autocomplete/Border'
};
export const Empty = function () {
    const [value, setValue] = useState('');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { onInput: handleInput, options: options, value: value, variant: "border" }));
};
export const Focused = function () {
    const [value, setValue] = useState('');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { ...useInitialFocus(), onInput: handleInput, options: options, value: value, variant: "border" }));
};
export const Placeholder = function () {
    const [value, setValue] = useState('');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { onInput: handleInput, options: options, placeholder: "Placeholder", value: value, variant: "border" }));
};
export const Filled = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { onInput: handleInput, options: options, value: value, variant: "border" }));
};
export const Disabled = function () {
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput() {
        throw new Error('This function should not be called');
    }
    return (h(TextboxAutocomplete, { disabled: true, onInput: handleInput, options: options, value: "foo", variant: "border" }));
};
export const DisabledOption = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { disabled: true, value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { onInput: handleInput, options: options, value: value, variant: "border" }));
};
export const Icon = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { icon: h(IconLayerFrame16, null), onInput: handleInput, options: options, value: value, variant: "border" }));
};
export const TextIcon = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { icon: "W", onInput: handleInput, options: options, value: value, variant: "border" }));
};
export const RevertOnEscapeKeyDown = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { onInput: handleInput, options: options, revertOnEscapeKeyDown: true, value: value, variant: "border" }));
};
export const Strict = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { onInput: handleInput, options: options, strict: true, value: value, variant: "border" }));
};
export const Filter = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { filter: true, onInput: handleInput, options: options, value: value, variant: "border" }));
};
export const StrictFilter = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { filter: true, onInput: handleInput, options: options, strict: true, value: value, variant: "border" }));
};
export const MenuTop = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { onInput: handleInput, options: options, top: true, value: value, variant: "border" }));
};
export const OnValueInput = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleValueInput(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxAutocomplete, { onValueInput: handleValueInput, options: options, value: value, variant: "border" }));
};
//# sourceMappingURL=textbox-autocomplete-border.stories.js.map