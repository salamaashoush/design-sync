import { h } from 'preact';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { Button } from '../button.js';
export default {
    tags: ['4'],
    title: 'Components/Button/Secondary Danger'
};
export const Passive = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { danger: true, onClick: handleClick, secondary: true }, "Text"));
};
export const Focused = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { ...useInitialFocus(), danger: true, onClick: handleClick, secondary: true }, "Text"));
};
export const Disabled = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { danger: true, disabled: true, onClick: handleClick, secondary: true }, "Text"));
};
export const Loading = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { danger: true, loading: true, onClick: handleClick, secondary: true }, "Text"));
};
export const LoadingFocused = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { ...useInitialFocus(), danger: true, loading: true, onClick: handleClick, secondary: true }, "Text"));
};
export const LoadingDisabled = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { danger: true, disabled: true, loading: true, onClick: handleClick, secondary: true }, "Text"));
};
export const FullWidth = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { danger: true, fullWidth: true, onClick: handleClick, secondary: true }, "Text"));
};
FullWidth.parameters = {
    fixedWidth: true
};
//# sourceMappingURL=button-secondary-danger.stories.js.map