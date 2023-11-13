import { h } from 'preact';
import { useInitialFocus } from '../../../hooks/use-initial-focus/use-initial-focus.js';
import { Button } from '../button.js';
export default {
    tags: ['2'],
    title: 'Components/Button/Danger'
};
export const Passive = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { danger: true, onClick: handleClick }, "Text"));
};
export const Focused = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { ...useInitialFocus(), danger: true, onClick: handleClick }, "Text"));
};
export const Disabled = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { danger: true, disabled: true, onClick: handleClick }, "Text"));
};
export const Loading = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { danger: true, loading: true, onClick: handleClick }, "Text"));
};
export const LoadingFocused = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { ...useInitialFocus(), danger: true, loading: true, onClick: handleClick }, "Text"));
};
export const LoadingDisabled = function () {
    function handleClick() {
        throw new Error('This function should not be called');
    }
    return (h(Button, { danger: true, disabled: true, loading: true, onClick: handleClick }, "Text"));
};
export const FullWidth = function () {
    function handleClick(event) {
        console.log(event);
    }
    return (h(Button, { danger: true, fullWidth: true, onClick: handleClick }, "Text"));
};
FullWidth.parameters = {
    fixedWidth: true
};
//# sourceMappingURL=button-danger.stories.js.map