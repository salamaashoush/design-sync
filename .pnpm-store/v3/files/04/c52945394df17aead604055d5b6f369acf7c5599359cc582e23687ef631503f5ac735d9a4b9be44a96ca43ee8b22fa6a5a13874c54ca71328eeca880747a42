import { MIXED_STRING } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { TextboxColor } from '../textbox-color.js';
export default {
    tags: ['1'],
    title: 'Components/Textbox Color/Default'
};
export const Empty = function () {
    const [hexColor, setHexColor] = useState('');
    const [opacity, setOpacity] = useState('');
    function handleHexColorInput(event) {
        const newHexColor = event.currentTarget.value;
        console.log(newHexColor);
        setHexColor(newHexColor);
    }
    function handleOpacityInput(event) {
        const newOpacity = event.currentTarget.value;
        console.log(newOpacity);
        setOpacity(newOpacity);
    }
    return (h(TextboxColor, { hexColor: hexColor, onHexColorInput: handleHexColorInput, onOpacityInput: handleOpacityInput, opacity: opacity }));
};
export const Focused = function () {
    const [hexColor, setHexColor] = useState('');
    const [opacity, setOpacity] = useState('');
    function handleHexColorInput(event) {
        const newHexColor = event.currentTarget.value;
        console.log(newHexColor);
        setHexColor(newHexColor);
    }
    function handleOpacityInput(event) {
        const newOpacity = event.currentTarget.value;
        console.log(newOpacity);
        setOpacity(newOpacity);
    }
    return (h(TextboxColor, { ...useInitialFocus(), hexColor: hexColor, onHexColorInput: handleHexColorInput, onOpacityInput: handleOpacityInput, opacity: opacity }));
};
export const Placeholder = function () {
    const [hexColor, setHexColor] = useState('');
    const [opacity, setOpacity] = useState('');
    function handleHexColorInput(event) {
        const newHexColor = event.currentTarget.value;
        console.log(newHexColor);
        setHexColor(newHexColor);
    }
    function handleOpacityInput(event) {
        const newOpacity = event.currentTarget.value;
        console.log(newOpacity);
        setOpacity(newOpacity);
    }
    return (h(TextboxColor, { hexColor: hexColor, hexColorPlaceholder: "Color", onHexColorInput: handleHexColorInput, onOpacityInput: handleOpacityInput, opacity: opacity, opacityPlaceholder: "%" }));
};
export const Filled = function () {
    const [hexColor, setHexColor] = useState('0D99FF');
    const [opacity, setOpacity] = useState('100%');
    function handleHexColorInput(event) {
        const newHexColor = event.currentTarget.value;
        console.log(newHexColor);
        setHexColor(newHexColor);
    }
    function handleOpacityInput(event) {
        const newOpacity = event.currentTarget.value;
        console.log(newOpacity);
        setOpacity(newOpacity);
    }
    return (h(TextboxColor, { hexColor: hexColor, onHexColorInput: handleHexColorInput, onOpacityInput: handleOpacityInput, opacity: opacity }));
};
export const Disabled = function () {
    const [hexColor, setHexColor] = useState('0D99FF');
    const [opacity, setOpacity] = useState('100%');
    function handleHexColorInput(event) {
        const newHexColor = event.currentTarget.value;
        console.log(newHexColor);
        setHexColor(newHexColor);
    }
    function handleOpacityInput(event) {
        const newOpacity = event.currentTarget.value;
        console.log(newOpacity);
        setOpacity(newOpacity);
    }
    return (h(TextboxColor, { disabled: true, hexColor: hexColor, onHexColorInput: handleHexColorInput, onOpacityInput: handleOpacityInput, opacity: opacity }));
};
export const Mixed = function () {
    const [hexColor, setHexColor] = useState(MIXED_STRING);
    const [opacity, setOpacity] = useState(MIXED_STRING);
    function handleHexColorInput(event) {
        const newHexColor = event.currentTarget.value;
        console.log(newHexColor);
        setHexColor(newHexColor);
    }
    function handleOpacityInput(event) {
        const newOpacity = event.currentTarget.value;
        console.log(newOpacity);
        setOpacity(newOpacity);
    }
    return (h(TextboxColor, { hexColor: hexColor, onHexColorInput: handleHexColorInput, onOpacityInput: handleOpacityInput, opacity: opacity }));
};
export const RevertOnEscapeKeyDown = function () {
    const [hexColor, setHexColor] = useState('0D99FF');
    const [opacity, setOpacity] = useState('100%');
    function handleHexColorInput(event) {
        const newHexColor = event.currentTarget.value;
        console.log(newHexColor);
        setHexColor(newHexColor);
    }
    function handleOpacityInput(event) {
        const newOpacity = event.currentTarget.value;
        console.log(newOpacity);
        setOpacity(newOpacity);
    }
    return (h(TextboxColor, { hexColor: hexColor, onHexColorInput: handleHexColorInput, onOpacityInput: handleOpacityInput, opacity: opacity, revertOnEscapeKeyDown: true }));
};
export const OnValueInput = function () {
    const [hexColor, setHexColor] = useState('0D99FF');
    const [opacity, setOpacity] = useState('100%');
    function handleRgbaColorValueInput(newRgbaColor) {
        console.log(newRgbaColor);
    }
    function handleOpacityNumericValueInput(newOpacity) {
        console.log(newOpacity);
    }
    return (h(TextboxColor, { hexColor: hexColor, onHexColorValueInput: setHexColor, onOpacityNumericValueInput: handleOpacityNumericValueInput, onOpacityValueInput: setOpacity, onRgbaColorValueInput: handleRgbaColorValueInput, opacity: opacity }));
};
//# sourceMappingURL=textbox-color-default.stories.js.map