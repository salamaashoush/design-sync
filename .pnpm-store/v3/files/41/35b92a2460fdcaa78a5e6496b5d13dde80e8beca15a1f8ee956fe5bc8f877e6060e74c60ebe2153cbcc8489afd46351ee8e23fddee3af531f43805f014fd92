import { h } from 'preact';
import { IconCheckCircle32 } from '../../../icons/icon-32/icon-check-circle-32.js';
import { IconInfo32 } from '../../../icons/icon-32/icon-info-32.js';
import { IconWarning32 } from '../../../icons/icon-32/icon-warning-32.js';
import { Banner } from '../banner.js';
export default {
    parameters: {
        fixedWidth: true
    },
    title: 'Components/Banner'
};
export const Default = function () {
    return h(Banner, { icon: h(IconInfo32, null) }, "Text");
};
export const Success = function () {
    return (h(Banner, { icon: h(IconCheckCircle32, null), variant: "success" }, "Text"));
};
export const Warning = function () {
    return (h(Banner, { icon: h(IconWarning32, null), variant: "warning" }, "Text"));
};
//# sourceMappingURL=banner.stories.js.map