import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { IconChevronDown32 } from '../../../icons/icon-32/icon-chevron-down-32.js';
import { Button } from '../../button/button.js';
import { Modal } from '../modal.js';
export default {
    tags: ['1'],
    title: 'Components/Modal/Default'
};
export const Default = function () {
    const [open, setOpen] = useState(false);
    function handleOpenButtonClick(event) {
        console.log(event);
        setOpen(true);
    }
    function handleCloseButtonClick(event) {
        console.log(event);
        setOpen(false);
    }
    const style = { height: '160px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleOpenButtonClick }, "Open"),
        h(Modal, { open: open },
            h("div", { style: style },
                h(Button, { onClick: handleCloseButtonClick, secondary: true }, "Close")))));
};
export const TransitionFalse = function () {
    const [open, setOpen] = useState(false);
    function handleOpenButtonClick(event) {
        console.log(event);
        setOpen(true);
    }
    function handleCloseButtonClick(event) {
        console.log(event);
        setOpen(false);
    }
    const style = { height: '160px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleOpenButtonClick }, "Open"),
        h(Modal, { open: open, transition: false },
            h("div", { style: style },
                h(Button, { onClick: handleCloseButtonClick, secondary: true }, "Close")))));
};
export const CloseOnOverlayClick = function () {
    const [open, setOpen] = useState(false);
    function handleOpenButtonClick(event) {
        console.log(event);
        setOpen(true);
    }
    function handleOverlayClick(event) {
        console.log(event);
        setOpen(false);
    }
    const style = { height: '160px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleOpenButtonClick }, "Open"),
        h(Modal, { onOverlayClick: handleOverlayClick, open: open },
            h("div", { style: style }, "foo"))));
};
export const CloseOnEscapeKeyDown = function () {
    const [open, setOpen] = useState(false);
    function handleOpenButtonClick(event) {
        console.log(event);
        setOpen(true);
    }
    function handleEscapeKeyDown(event) {
        console.log(event);
        setOpen(false);
    }
    const style = { height: '160px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleOpenButtonClick }, "Open"),
        h(Modal, { onEscapeKeyDown: handleEscapeKeyDown, open: open },
            h("div", { style: style }, "foo"))));
};
export const Title = function () {
    const [open, setOpen] = useState(false);
    function handleOpenButtonClick(event) {
        console.log(event);
        setOpen(true);
    }
    function handleCloseButtonClick(event) {
        console.log(event);
        setOpen(false);
    }
    const style = { height: '160px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleOpenButtonClick }, "Open"),
        h(Modal, { open: open, title: "foo" },
            h("div", { style: style },
                h(Button, { onClick: handleCloseButtonClick, secondary: true }, "Close")))));
};
export const CloseButton = function () {
    const [open, setOpen] = useState(false);
    function handleOpenButtonClick(event) {
        console.log(event);
        setOpen(true);
    }
    function handleCloseButtonClick(event) {
        console.log(event);
        setOpen(false);
    }
    const style = { height: '160px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleOpenButtonClick }, "Open"),
        h(Modal, { onCloseButtonClick: handleCloseButtonClick, open: open, title: "foo" },
            h("div", { style: style }, "bar"))));
};
export const CloseButtonIcon = function () {
    const [open, setOpen] = useState(false);
    function handleOpenButtonClick(event) {
        console.log(event);
        setOpen(true);
    }
    function handleCloseButtonClick(event) {
        console.log(event);
        setOpen(false);
    }
    const style = { height: '160px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleOpenButtonClick }, "Open"),
        h(Modal, { closeButtonIcon: h(IconChevronDown32, null), onCloseButtonClick: handleCloseButtonClick, open: open, title: "foo" },
            h("div", { style: style }, "bar"))));
};
export const CloseButtonPositionLeft = function () {
    const [open, setOpen] = useState(false);
    function handleOpenButtonClick(event) {
        console.log(event);
        setOpen(true);
    }
    function handleCloseButtonClick(event) {
        console.log(event);
        setOpen(false);
    }
    const style = { height: '160px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleOpenButtonClick }, "Open"),
        h(Modal, { closeButtonPosition: "left", onCloseButtonClick: handleCloseButtonClick, open: open, title: "foo" },
            h("div", { style: style }, "bar"))));
};
export const Nested = function () {
    const [parentOpen, setParentOpen] = useState(false);
    function handleParentOpenButtonClick(event) {
        console.log(event);
        setParentOpen(true);
    }
    function handleParentCloseButtonClick(event) {
        console.log(event);
        setParentOpen(false);
    }
    const parentStyle = { height: '160px', padding: '12px', width: '240px' };
    const [childOpen, setChildOpen] = useState(false);
    function handleChildOpenButtonClick(event) {
        console.log(event);
        setChildOpen(true);
    }
    function handleChildCloseButtonClick(event) {
        console.log(event);
        setChildOpen(false);
    }
    const childStyle = { height: '120px', padding: '12px', width: '240px' };
    return (h(Fragment, null,
        h(Button, { onClick: handleParentOpenButtonClick }, "Open parent modal"),
        h(Modal, { onCloseButtonClick: handleParentCloseButtonClick, open: parentOpen, title: "Parent" },
            h("div", { style: parentStyle },
                h(Button, { onClick: handleChildOpenButtonClick }, "Open child modal"),
                h(Modal, { onCloseButtonClick: handleChildCloseButtonClick, open: childOpen, title: "Child" },
                    h("div", { style: childStyle }))))));
};
//# sourceMappingURL=modal-default.stories.js.map