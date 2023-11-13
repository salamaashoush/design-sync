import { MIXED_STRING } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { TextboxMultiline } from '../textbox-multiline.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['3'],
    title: 'Components/Textbox Multiline/Underline'
};
export const Empty = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onInput: handleInput, value: value, variant: "underline" }));
};
export const Focused = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { ...useInitialFocus(), onInput: handleInput, value: value, variant: "underline" }));
};
export const Placeholder = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onInput: handleInput, placeholder: "Placeholder", value: value, variant: "underline" }));
};
export const Filled = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onInput: handleInput, value: value, variant: "underline" }));
};
export const Disabled = function () {
    function handleInput() {
        throw new Error('This function should not be called');
    }
    return (h(TextboxMultiline, { disabled: true, onInput: handleInput, value: "Text", variant: "underline" }));
};
export const Mixed = function () {
    const [value, setValue] = useState(MIXED_STRING);
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onInput: handleInput, value: value, variant: "underline" }));
};
export const RevertOnEscapeKeyDown = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onInput: handleInput, revertOnEscapeKeyDown: true, value: value, variant: "underline" }));
};
export const ValidateOnBlur = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    function validateOnBlur(value) {
        return value !== '';
    }
    return (h(TextboxMultiline, { onInput: handleInput, validateOnBlur: validateOnBlur, value: value, variant: "underline" }));
};
export const Rows = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onInput: handleInput, rows: 5, value: value, variant: "underline" }));
};
export const AutoGrow = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { grow: true, onInput: handleInput, rows: 1, value: value, variant: "underline" }));
};
export const Ref = function () {
    const ref = useRef(null);
    const [value, setValue] = useState('Text');
    function handleInput() {
        if (ref.current === null) {
            throw new Error('`ref.current` is `null`');
        }
        console.log(ref.current);
        const newValue = ref.current.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { ref: ref, onInput: handleInput, value: value, variant: "underline" }));
};
export const OnValueInput = function () {
    const [value, setValue] = useState('Text');
    function handleValueInput(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onValueInput: handleValueInput, value: value, variant: "underline" }));
};
//# sourceMappingURL=textbox-multiline-underline.stories.js.map