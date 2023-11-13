import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { VerticalSpace } from '../../../layout/vertical-space/vertical-space.js';
import { TextboxNumeric } from '../../textbox/textbox-numeric/textbox-numeric.js';
import { RangeSlider } from '../range-slider.js';
export default {
    parameters: {
        fixedWidth: true
    },
    title: 'Components/Range Slider'
};
export const Passive = function () {
    const [value, setValue] = useState('0');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(RangeSlider, { maximum: 100, minimum: 0, onInput: handleInput, value: value }));
};
export const Focused = function () {
    const [value, setValue] = useState('0');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(RangeSlider, { ...useInitialFocus(), maximum: 100, minimum: 0, onInput: handleInput, value: value }));
};
export const Disabled = function () {
    function handleInput() {
        throw new Error('This function should not be called');
    }
    return (h(RangeSlider, { disabled: true, maximum: 100, minimum: 0, onInput: handleInput, value: "0" }));
};
export const CustomIncrement = function () {
    const [value, setValue] = useState('0');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(RangeSlider, { increment: 10, maximum: 100, minimum: 0, onInput: handleInput, value: value }));
};
export const OnValueInput = function () {
    const [value, setValue] = useState('0');
    function handleValueInput(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    function handleNumericValueInput(newNumericValue) {
        console.log(newNumericValue);
    }
    return (h(RangeSlider, { maximum: 100, minimum: 0, onNumericValueInput: handleNumericValueInput, onValueInput: handleValueInput, value: value }));
};
export const WithTextboxNumeric = function () {
    const [value, setValue] = useState('0');
    function handleInput(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const minimum = 0;
    const maximum = 100;
    return (h(Fragment, null,
        h(RangeSlider, { maximum: maximum, minimum: minimum, onInput: handleInput, value: value }),
        h(VerticalSpace, { space: "small" }),
        h(TextboxNumeric, { maximum: maximum, minimum: minimum, onInput: handleInput, value: value, variant: "border" })));
};
//# sourceMappingURL=range-slider.stories.js.map