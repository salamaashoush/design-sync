import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { SearchTextbox } from '../search-textbox.js';
export default {
    parameters: {
        fixedWidth: true
    },
    title: 'Components/Search Textbox'
};
export const Empty = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(SearchTextbox, { onInput: handleInput, value: value });
};
export const EmptyFocused = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SearchTextbox, { ...useInitialFocus(), onInput: handleInput, value: value }));
};
export const EmptyDisabled = function () {
    function handleInput() {
        throw new Error('This function should not be called');
    }
    return h(SearchTextbox, { disabled: true, onInput: handleInput, value: "" });
};
export const Filled = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(SearchTextbox, { onInput: handleInput, value: value });
};
export const FilledFocused = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SearchTextbox, { ...useInitialFocus(), onInput: handleInput, value: value }));
};
export const FilledDisabled = function () {
    function handleInput() {
        throw new Error('This function should not be called');
    }
    return h(SearchTextbox, { disabled: true, onInput: handleInput, value: "Text" });
};
export const Placeholder = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SearchTextbox, { onInput: handleInput, placeholder: "Placeholder", value: value }));
};
export const ClearOnEscapeKeyDown = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(SearchTextbox, { clearOnEscapeKeyDown: true, onInput: handleInput, value: value }));
};
export const OnValueInput = function () {
    const [value, setValue] = useState('Text');
    function handleValueInput(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return h(SearchTextbox, { onValueInput: handleValueInput, value: value });
};
//# sourceMappingURL=search-textbox.stories.js.map