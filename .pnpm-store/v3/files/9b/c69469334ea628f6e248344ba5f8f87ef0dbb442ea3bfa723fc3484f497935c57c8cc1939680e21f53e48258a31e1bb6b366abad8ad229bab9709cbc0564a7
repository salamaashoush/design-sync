import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { Disclosure } from '../disclosure.js';
export default {
    parameters: {
        fixedWidth: true
    },
    tags: ['1'],
    title: 'Components/Disclosure/Closed'
};
export const Default = function () {
    const [open, setOpen] = useState(false);
    function handleClick(event) {
        console.log(event);
        setOpen(!(open === true));
    }
    const style = { height: '64px' };
    return (h("div", { style: style },
        h(Disclosure, { onClick: handleClick, open: open, title: "foo" }, "bar")));
};
export const Focused = function () {
    const [open, setOpen] = useState(false);
    function handleClick(event) {
        console.log(event);
        setOpen(!(open === true));
    }
    const style = { height: '64px' };
    return (h("div", { style: style },
        h(Disclosure, { ...useInitialFocus(), onClick: handleClick, open: open, title: "foo" }, "bar")));
};
//# sourceMappingURL=disclosure-closed.stories.js.map