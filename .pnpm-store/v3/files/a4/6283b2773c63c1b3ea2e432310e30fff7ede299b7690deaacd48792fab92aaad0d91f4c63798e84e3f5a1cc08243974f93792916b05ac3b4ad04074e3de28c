import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { Banner } from './components/banner/banner.js';
import { Button } from './components/button/button.js';
import { Dropdown } from './components/dropdown/dropdown.js';
import { FileUploadButton } from './components/file-upload/file-upload-button/file-upload-button.js';
import { FileUploadDropzone } from './components/file-upload/file-upload-dropzone/file-upload-dropzone.js';
import { Layer } from './components/layer/layer.js';
import { Modal } from './components/modal/modal.js';
import { RangeSlider } from './components/range-slider/range-slider.js';
import { SegmentedControl } from './components/segmented-control/segmented-control.js';
import { Text } from './components/text/text.js';
import { TextboxColor } from './components/textbox/textbox-color/textbox-color.js';
import { TextboxNumeric } from './components/textbox/textbox-numeric/textbox-numeric.js';
import { Toggle } from './components/toggle/toggle.js';
import { IconLayerComponent16 } from './icons/icon-16/icon-layer-component-16.js';
import { IconLayerFrame16 } from './icons/icon-16/icon-layer-frame-16.js';
import { IconSpaceHorizontal16 } from './icons/icon-16/icon-space-horizontal-16.js';
import { IconCheckCircle32 } from './icons/icon-32/icon-check-circle-32.js';
import { IconInfo32 } from './icons/icon-32/icon-info-32.js';
import { IconWarning32 } from './icons/icon-32/icon-warning-32.js';
import { Bold } from './inline-text/bold/bold.js';
import { Muted } from './inline-text/muted/muted.js';
import { Columns } from './layout/columns/columns.js';
import { Stack } from './layout/stack/stack.js';
import { VerticalSpace } from './layout/vertical-space/vertical-space.js';
export default {
    title: 'Index'
};
const boxStyle = {
    alignItems: 'center',
    backgroundColor: 'var(--figma-color-bg-secondary)',
    display: 'flex',
    height: '92px',
    justifyContent: 'center',
    padding: '24px 40px'
};
export const Index = function () {
    const [componentLayerValue, setComponentLayerValue] = useState(true);
    const [dropdownValue, setDropdownValue] = useState('Regular');
    const [frameLayerValue, setFrameLayerValue] = useState(true);
    const [rangeSliderValue, setRangeSliderValue] = useState('42');
    const [segmentedControlValue, setSegmentedControlValue] = useState('1st');
    const [textboxColorHexColor, setTextboxColorHexColor] = useState('0D99FF');
    const [textboxColorOpacity, setTextboxColorOpacity] = useState('50%');
    const [textboxNumericValue, setTextboxNumericValue] = useState('42');
    const [toggleValue, setToggleValue] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    return (h(Fragment, null,
        h(Columns, { space: "extraLarge" },
            h("div", { style: { width: '240px' } },
                h(Stack, { space: "large" },
                    h("div", { style: boxStyle },
                        h(Toggle, { onChange: function (event) {
                                setToggleValue(event.currentTarget.checked);
                            }, value: toggleValue },
                            h(Text, null, "Auto-update"))),
                    h(Stack, { space: "extraSmall" },
                        h(Button, { fullWidth: true }, "Make Something Wonderful"),
                        h(Button, { danger: true, fullWidth: true }, "Discard Changes"),
                        h(Button, { disabled: true, fullWidth: true, loading: true }, "Loading")),
                    h("div", { style: boxStyle },
                        h(TextboxNumeric, { icon: h(IconSpaceHorizontal16, null), onInput: function (event) {
                                setTextboxNumericValue(event.currentTarget.value);
                            }, value: textboxNumericValue, variant: "border" })),
                    h(Stack, { space: "extraSmall" },
                        h(Layer, { icon: h(IconLayerFrame16, null), onChange: function (event) {
                                setFrameLayerValue(event.currentTarget.checked);
                            }, value: frameLayerValue }, "Frame"),
                        h(Layer, { bold: true, component: true, icon: h(IconLayerComponent16, null), onChange: function (event) {
                                setComponentLayerValue(event.currentTarget.checked);
                            }, value: componentLayerValue }, "Component")),
                    h("div", { style: boxStyle },
                        h(RangeSlider, { maximum: 100, minimum: 0, onInput: function (event) {
                                setRangeSliderValue(event.currentTarget.value);
                            }, value: rangeSliderValue })),
                    h("div", { style: boxStyle },
                        h(Button, { onClick: function () {
                                setModalOpen(true);
                            }, secondary: true }, "Open Modal"),
                        h(Modal, { onCloseButtonClick: function () {
                                setModalOpen(false);
                            }, onOverlayClick: function () {
                                setModalOpen(false);
                            }, open: modalOpen, title: "Modal" },
                            h("div", { style: { height: '120px', padding: '16px', width: '240px' } },
                                h(Button, { onClick: function () {
                                        setModalOpen(false);
                                    }, secondary: true }, "Close Modal")))))),
            h("div", { style: { width: '240px' } },
                h(Stack, { space: "large" },
                    h("div", { style: boxStyle },
                        h(SegmentedControl, { onChange: function (event) {
                                setSegmentedControlValue(event.currentTarget.value);
                            }, options: [{ value: '1st' }, { value: '2nd' }, { value: '3rd' }], value: segmentedControlValue })),
                    h(FileUploadDropzone, { acceptedFileTypes: ['image/jpeg', 'image/png'], multiple: true },
                        h(Text, { align: "center" },
                            h(Bold, null, "Drop images here")),
                        h(VerticalSpace, { space: "small" }),
                        h(Text, { align: "center" },
                            h(Muted, null, "or")),
                        h(VerticalSpace, { space: "small" }),
                        h(FileUploadButton, { acceptedFileTypes: ['image/jpeg', 'image/png'] }, "Choose Image Files")),
                    h("div", { style: boxStyle },
                        h(Dropdown, { onChange: function (event) {
                                setDropdownValue(event.currentTarget.value);
                            }, options: [
                                { value: 'Light' },
                                { value: 'Regular' },
                                { value: 'Semibold' },
                                { value: 'Bold' }
                            ], value: dropdownValue, variant: "border" })),
                    h(Stack, { space: "extraSmall" },
                        h(Banner, { icon: h(IconInfo32, null) }, "Select a layer to get started"),
                        h(Banner, { icon: h(IconCheckCircle32, null), variant: "success" }, "Plugin unlocked"),
                        h(Banner, { icon: h(IconWarning32, null), variant: "warning" }, "Invalid license key")),
                    h("div", { style: boxStyle },
                        h(TextboxColor, { hexColor: textboxColorHexColor, onHexColorInput: function (event) {
                                setTextboxColorHexColor(event.currentTarget.value);
                            }, onOpacityInput: function (event) {
                                setTextboxColorOpacity(event.currentTarget.value);
                            }, opacity: textboxColorOpacity, variant: "border" })))))));
};
//# sourceMappingURL=index.stories.js.map