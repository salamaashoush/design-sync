import { h } from 'preact';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { Button } from '../button.js';
export default {
    tags: ['3'],
    title: 'Components/Button/Secondary'
};
export const Passive = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { onClick: handleClick, secondary: true }, "Text"));
};
export const Focused = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { ...useInitialFocus(), onClick: handleClick, secondary: true }, "Text"));
};
export const Disabled = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { disabled: true, onClick: handleClick, secondary: true }, "Text"));
};
export const Loading = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { loading: true, onClick: handleClick, secondary: true }, "Text"));
};
export const LoadingFocused = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { ...useInitialFocus(), loading: true, onClick: handleClick, secondary: true }, "Text"));
};
export const LoadingDisabled = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { disabled: true, loading: true, onClick: handleClick, secondary: true }, "Text"));
};
export const FullWidth = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { fullWidth: true, onClick: handleClick, secondary: true }, "Text"));
};
FullWidth.parameters = {
    fixedWidth: true
};
//# sourceMappingURL=button-secondary.stories.js.map