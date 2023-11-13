import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Tabs } from '../tabs.js';
export default {
    parameters: {
        fixedWidth: true
    },
    title: 'Components/Tabs'
};
export const Passive = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { children: h("div", null, "Foo"), value: 'foo' },
        { children: h("div", null, "Bar"), value: 'bar' },
        { children: h("div", null, "Baz"), value: 'baz' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Tabs, { onChange: handleChange, options: options, value: value });
};
export const OnValueChange = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { children: h("div", null, "Foo"), value: 'foo' },
        { children: h("div", null, "Bar"), value: 'bar' },
        { children: h("div", null, "Baz"), value: 'baz' }
    ];
    function handleValueChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Tabs, { onValueChange: handleValueChange, options: options, value: value }));
};
//# sourceMappingURL=tabs.stories.js.map