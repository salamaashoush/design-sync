import { h } from 'preact';
import { Text } from '../text.js';
export default {
    parameters: {
        fixedWidth: true
    },
    title: 'Components/Text'
};
export const Default = function () {
    return h(Text, null, "Text");
};
export const Numeric = function () {
    return h(Text, { numeric: true }, "3.142");
};
export const AlignLeft = function () {
    const style = { backgroundColor: 'var(--figma-color-bg-brand-tertiary)' };
    return (h("div", { style: style },
        h(Text, { align: "left" }, "Text")));
};
export const AlignCenter = function () {
    const style = { backgroundColor: 'var(--figma-color-bg-brand-tertiary)' };
    return (h("div", { style: style },
        h(Text, { align: "center" }, "Text")));
};
export const AlignRight = function () {
    const style = { backgroundColor: 'var(--figma-color-bg-brand-tertiary)' };
    return (h("div", { style: style },
        h(Text, { align: "right" }, "Text")));
};
//# sourceMappingURL=text.stories.js.map