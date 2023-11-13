import { MIXED_STRING } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconLayerFrame16 } from '../../../../icons/icon-16/icon-layer-frame-16.js';
import { TextboxNumeric } from '../textbox-numeric.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['2'],
    title: 'Components/Textbox Numeric/Border'
};
export const Empty = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxNumeric, { onInput: handleInput, value: value, variant: "border" });
};
export const Focused = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { ...useInitialFocus(), onInput: handleInput, value: value, variant: "border" }));
};
export const Placeholder = function () {
    const [value, setValue] = useState('');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { onInput: handleInput, placeholder: "Placeholder", value: value, variant: "border" }));
};
export const Filled = function () {
    const [value, setValue] = useState('42');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxNumeric, { onInput: handleInput, value: value, variant: "border" });
};
export const Disabled = function () {
    function handleInput() {
        throw new Error('This function should not be called');
    }
    return (h(TextboxNumeric, { disabled: true, onInput: handleInput, value: "42", variant: "border" }));
};
export const Icon = function () {
    const [value, setValue] = useState('42');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { icon: h(IconLayerFrame16, null), onInput: handleInput, value: value, variant: "border" }));
};
export const TextIcon = function () {
    const [value, setValue] = useState('42');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { icon: "W", onInput: handleInput, value: value, variant: "border" }));
};
export const Mixed = function () {
    const [value, setValue] = useState(MIXED_STRING);
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(TextboxNumeric, { onInput: handleInput, value: value, variant: "border" });
};
export const RevertOnEscapeKeyDown = function () {
    const [value, setValue] = useState('42');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { onInput: handleInput, revertOnEscapeKeyDown: true, value: value, variant: "border" }));
};
export const ValidateOnBlur = function () {
    const [value, setValue] = useState('42');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    function validateOnBlur(value) {
        console.log(value);
        return value !== null;
    }
    return (h(TextboxNumeric, { onInput: handleInput, validateOnBlur: validateOnBlur, value: value, variant: "border" }));
};
export const IntegerOnly = function () {
    const [value, setValue] = useState('42');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { integer: true, onInput: handleInput, value: value, variant: "border" }));
};
export const CustomIncrements = function () {
    const [value, setValue] = useState('42');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { incrementBig: 100, incrementSmall: 10, onInput: handleInput, value: value, variant: "border" }));
};
export const CustomSmallIncrements = function () {
    const [value, setValue] = useState('0');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { incrementBig: 0.5, incrementSmall: 0.1, onInput: handleInput, value: value, variant: "border" }));
};
export const MinimumMaximum = function () {
    const [value, setValue] = useState('0');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { maximum: 10, minimum: 0, onInput: handleInput, value: value, variant: "border" }));
};
export const Suffix = function () {
    const [value, setValue] = useState('100%');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { maximum: 100, minimum: 0, onInput: handleInput, suffix: "%", value: value, variant: "border" }));
};
export const Ref = function () {
    const ref = useRef(null);
    const [value, setValue] = useState('42');
    function handleInput() {
        if (ref.current === null) {
            throw new Error('`ref.current` is `null`');
        }
        console.log(ref.current);
        const newValue = ref.current.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(TextboxNumeric, { ref: ref, onInput: handleInput, value: value, variant: "border" }));
};
export const OnValueInput = function () {
    const [value, setValue] = useState('42');
    function handleValueInput(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    function handleNumericValueInput(newNumericValue) {
        console.log(newNumericValue);
    }
    return (h(TextboxNumeric, { onNumericValueInput: handleNumericValueInput, onValueInput: handleValueInput, value: value, variant: "border" }));
};
//# sourceMappingURL=textbox-numeric-border.stories.js.map