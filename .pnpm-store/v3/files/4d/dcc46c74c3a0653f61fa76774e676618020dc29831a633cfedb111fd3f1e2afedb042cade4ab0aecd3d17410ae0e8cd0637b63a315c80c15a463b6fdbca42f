import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconLayerFrame16 } from '../../../icons/icon-16/icon-layer-frame-16.js';
import { Layer } from '../layer.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['1'],
    title: 'Components/Layer/Frame Unselected'
};
export const Passive = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { icon: h(IconLayerFrame16, null), onChange: handleChange, value: value }, "Text"));
};
export const Focused = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { ...useInitialFocus(), icon: h(IconLayerFrame16, null), onChange: handleChange, value: value }, "Text"));
};
export const Bold = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { bold: true, icon: h(IconLayerFrame16, null), onChange: handleChange, value: value }, "Text"));
};
export const Description = function () {
    const [value, setValue] = useState(false);
    function handleChange(event) {
        const newValue = event.currentTarget.checked;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { description: "Description", icon: h(IconLayerFrame16, null), onChange: handleChange, value: value }, "Text"));
};
export const OnValueChange = function () {
    const [value, setValue] = useState(false);
    function handleValueChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Layer, { icon: h(IconLayerFrame16, null), onValueChange: handleValueChange, value: value }, "Text"));
};
//# sourceMappingURL=layer-frame-unselected.stories.js.map