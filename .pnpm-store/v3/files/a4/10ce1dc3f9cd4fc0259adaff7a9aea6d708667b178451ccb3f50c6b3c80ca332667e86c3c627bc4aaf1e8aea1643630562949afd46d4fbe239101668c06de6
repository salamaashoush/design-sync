import { MIXED_STRING } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconLayerFrame16 } from '../../../../icons/icon-16/icon-layer-frame-16.js';
import { Textbox } from '../textbox.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['2'],
    title: 'Components/Textbox/Border'
};
export const Empty = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Textbox, { onInput: handleInput, value: value, variant: "border" });
};
export const Focused = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Textbox, { ...useInitialFocus(), onInput: handleInput, value: value, variant: "border" }));
};
export const Placeholder = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Textbox, { onInput: handleInput, placeholder: "Placeholder", value: value, variant: "border" }));
};
export const Filled = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Textbox, { onInput: handleInput, value: value, variant: "border" });
};
export const Disabled = function () {
    function handleInput() {
        throw new Error('This function should not be called');
    }
    return (h(Textbox, { disabled: true, onInput: handleInput, value: "Text", variant: "border" }));
};
export const Icon = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Textbox, { icon: h(IconLayerFrame16, null), onInput: handleInput, value: value, variant: "border" }));
};
export const TextIcon = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Textbox, { icon: "W", onInput: handleInput, value: value, variant: "border" }));
};
export const Mixed = function () {
    const [value, setValue] = useState(MIXED_STRING);
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Textbox, { onInput: handleInput, value: value, variant: "border" });
};
export const RevertOnEscapeKeyDown = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Textbox, { onInput: handleInput, revertOnEscapeKeyDown: true, value: value, variant: "border" }));
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
    return (h(Textbox, { onInput: handleInput, validateOnBlur: validateOnBlur, value: value }));
};
export const Password = function () {
    const [value, setValue] = useState('Text');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Textbox, { onInput: handleInput, password: true, value: value, variant: "border" }));
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
    return (h(Textbox, { ref: ref, onInput: handleInput, value: value, variant: "border" }));
};
export const OnValueInput = function () {
    const [value, setValue] = useState('Text');
    function handleValueInput(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Textbox, { onValueInput: handleValueInput, value: value, variant: "border" }));
};
//# sourceMappingURL=textbox-border.stories.js.map