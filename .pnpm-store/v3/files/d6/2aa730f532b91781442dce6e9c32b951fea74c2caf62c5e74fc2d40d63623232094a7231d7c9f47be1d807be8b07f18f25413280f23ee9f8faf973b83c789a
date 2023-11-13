import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconLayerComponent16 } from '../../../icons/icon-16/icon-layer-component-16.js';
import { Layer } from '../layer.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['4'],
    title: 'Components/Layer/Component Selected'
};
export const Passive = function () {
    const [value, setValue] = useState(true);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { component: true, icon: h(IconLayerComponent16, null), onChange: handleChange, value: value }, "Text"));
};
export const Focused = function () {
    const [value, setValue] = useState(true);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { ...useInitialFocus(), component: true, icon: h(IconLayerComponent16, null), onChange: handleChange, value: value }, "Text"));
};
export const Bold = function () {
    const [value, setValue] = useState(true);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { bold: true, component: true, icon: h(IconLayerComponent16, null), onChange: handleChange, value: value }, "Text"));
};
export const Description = function () {
    const [value, setValue] = useState(true);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { component: true, description: "Description", icon: h(IconLayerComponent16, null), onChange: handleChange, value: value }, "Text"));
};
export const OnValueChange = function () {
    const [value, setValue] = useState(true);
    function handleValueChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { component: true, icon: h(IconLayerComponent16, null), onValueChange: handleValueChange, value: value }, "Text"));
};
//# sourceMappingURL=layer-component-selected.stories.js.map