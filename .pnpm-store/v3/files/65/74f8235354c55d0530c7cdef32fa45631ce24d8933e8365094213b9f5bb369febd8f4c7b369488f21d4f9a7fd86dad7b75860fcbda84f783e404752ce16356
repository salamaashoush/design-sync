import { h } from 'preact';
import { Text } from '../../../components/text/text.js';
import { Link } from '../link.js';
export default {
    title: 'Inline Text/Link'
};
export const Default = function () {
    return (h(Text, null,
        h(Link, { href: "https://figma.com" }, "Link")));
};
export const NewWindow = function () {
    return (h(Text, null,
        h(Link, { href: "https://figma.com", target: "_blank" }, "Link")));
};
export const FullWidth = function () {
    const style = { backgroundColor: 'var(--figma-color-bg-brand-tertiary)' };
    return (h("div", { style: style },
        h(Text, null,
            h(Link, { fullWidth: true, href: "https://figma.com" }, "Link"))));
};
//# sourceMappingURL=link.stories.js.map