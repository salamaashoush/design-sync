import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { IconLayerFrame16 } from '../../../icons/icon-16/icon-layer-frame-16.js';
import { Dropdown } from '../dropdown.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['1'],
    title: 'Components/Dropdown/Default'
};
export const Empty = function () {
    const [value, setValue] = useState(null);
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h("div", null,
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const EmptyManyOptions = function () {
    const [value, setValue] = useState(null);
    const options = [...Array(100).keys()].map(function (index) {
        return { value: `${index + 1}` };
    });
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Dropdown, { onChange: handleChange, options: options, value: value });
};
export const Placeholder = function () {
    const [value, setValue] = useState(null);
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Dropdown, { onChange: handleChange, options: options, placeholder: "Placeholder", value: value }));
};
export const Filled = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Dropdown, { onChange: handleChange, options: options, value: value });
};
export const FilledManyOptions = function () {
    const [value, setValue] = useState('42');
    const options = [...Array(100).keys()].map(function (index) {
        return { value: `${index + 1}` };
    });
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Dropdown, { onChange: handleChange, options: options, value: value });
};
export const Focused = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Dropdown, { ...useInitialFocus(), onChange: handleChange, options: options, value: value }));
};
export const Disabled = function () {
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange() {
        throw new Error('This function should not be called');
    }
    return (h(Dropdown, { disabled: true, onChange: handleChange, options: options, value: "foo" }));
};
export const OptionDisabled = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { disabled: true, value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Dropdown, { onChange: handleChange, options: options, value: value });
};
export const OptionText = function () {
    const [value, setValue] = useState('a');
    const options = [
        {
            text: 'foo',
            value: 'a'
        },
        { text: 'bar', value: 'b' },
        { text: 'baz', value: 'c' },
        '-',
        { header: 'Header' },
        { text: 'qux', value: 'd' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return h(Dropdown, { onChange: handleChange, options: options, value: value });
};
export const Icon = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Dropdown, { icon: h(IconLayerFrame16, null), onChange: handleChange, options: options, value: value }));
};
export const TextIcon = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Dropdown, { icon: "W", onChange: handleChange, options: options, value: value }));
};
export const OnValueChange = function () {
    const [value, setValue] = useState('foo');
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleValueChange(newValue) {
        console.log(newValue);
        setValue(newValue);
    }
    return (h(Dropdown, { onValueChange: handleValueChange, options: options, value: value }));
};
export const TopLeft = function () {
    const [value, setValue] = useState(null);
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        left: '-8px',
        position: 'fixed',
        top: '-8px',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const TopLeftManyOptions = function () {
    const [value, setValue] = useState(null);
    const options = [...Array(100).keys()].map(function (index) {
        return { value: `${index + 1}` };
    });
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        left: '-8px',
        position: 'fixed',
        top: '-8px',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const TopRight = function () {
    const [value, setValue] = useState(null);
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        position: 'fixed',
        right: '-8px',
        top: '-8px',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const TopRightManyOptions = function () {
    const [value, setValue] = useState(null);
    const options = [...Array(100).keys()].map(function (index) {
        return { value: `${index + 1}` };
    });
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        position: 'fixed',
        right: '-8px',
        top: '-8px',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const MiddleLeft = function () {
    const [value, setValue] = useState(null);
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        left: '-8px',
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const MiddleLeftManyOptions = function () {
    const [value, setValue] = useState(null);
    const options = [...Array(100).keys()].map(function (index) {
        return { value: `${index + 1}` };
    });
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        left: '-8px',
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const MiddleRight = function () {
    const [value, setValue] = useState(null);
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        position: 'fixed',
        right: '-8px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const MiddleRightManyOptions = function () {
    const [value, setValue] = useState(null);
    const options = [...Array(100).keys()].map(function (index) {
        return { value: `${index + 1}` };
    });
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        position: 'fixed',
        right: '-8px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const BottomLeft = function () {
    const [value, setValue] = useState(null);
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        bottom: '-8px',
        left: '-8px',
        position: 'fixed',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const BottomLeftManyOptions = function () {
    const [value, setValue] = useState(null);
    const options = [...Array(100).keys()].map(function (index) {
        return { value: `${index + 1}` };
    });
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        bottom: '-8px',
        left: '-8px',
        position: 'fixed',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const BottomRight = function () {
    const [value, setValue] = useState(null);
    const options = [
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' },
        '-',
        { header: 'Header' },
        { value: 'qux' }
    ];
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        bottom: '-8px',
        position: 'fixed',
        right: '-8px',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
export const BottomRightManyOptions = function () {
    const [value, setValue] = useState(null);
    const options = [...Array(100).keys()].map(function (index) {
        return { value: `${index + 1}` };
    });
    function handleChange(event) {
        const newValue = event.currentTarget.value;
        console.log(newValue);
        setValue(newValue);
    }
    const style = {
        bottom: '-8px',
        position: 'fixed',
        right: '-8px',
        width: '240px'
    };
    return (h("div", { style: style },
        h(Dropdown, { onChange: handleChange, options: options, value: value })));
};
//# sourceMappingURL=dropdown-default.stories.js.map