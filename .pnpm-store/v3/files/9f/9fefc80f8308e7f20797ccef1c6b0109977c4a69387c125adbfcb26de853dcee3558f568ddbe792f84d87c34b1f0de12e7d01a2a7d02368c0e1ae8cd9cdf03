import { MIXED_STRING } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { TextboxMultiline } from '../textbox-multiline.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['1'],
    title: 'Components/Textbox Multiline/Default'
};
export const Empty = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxMultiline, { onInput: handleInput, value: value });
};
export const Focused = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { ...useInitialFocus(), onInput: handleInput, value: value }));
};
export const Placeholder = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onInput: handleInput, placeholder: "Placeholder", value: value }));
};
export const Filled = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxMultiline, { onInput: handleInput, value: value });
};
export const Disabled = function () {
    function handleInput() {
        throw new Error('This function should not be called');
    }
    return h(TextboxMultiline, { disabled: true, onInput: handleInput, value: "Text" });
};
export const Mixed = function () {
    const [value, setValue] = useState(MIXED_STRING);
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxMultiline, { onInput: handleInput, value: value });
};
export const RevertOnEscapeKeyDown = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxMultiline, { onInput: handleInput, revertOnEscapeKeyDown: true, value: value }));
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
    return (h(TextboxMultiline, { onInput: handleInput, validateOnBlur: validateOnBlur, value: value }));
};
export const Rows = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxMultiline, { onInput: handleInput, rows: 5, value: value });
};
export const AutoGrow = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxMultiline, { grow: true, onInput: handleInput, rows: 1, value: value });
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
    return h(TextboxMultiline, { ref: ref, onInput: handleInput, value: value });
};
export const OnValueInput = function () {
    const [value, setValue] = useState('Text');
    function handleValueInput(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxMultiline, { onValueInput: handleValueInput, value: value });
};
//# sourceMappingURL=textbox-multiline-default.stories.js.map