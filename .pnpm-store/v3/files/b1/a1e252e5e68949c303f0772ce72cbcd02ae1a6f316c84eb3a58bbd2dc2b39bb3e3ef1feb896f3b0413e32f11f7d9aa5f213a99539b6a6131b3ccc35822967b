import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { createClassName } from '../../utilities/create-class-name.js';
import { createComponent } from '../../utilities/create-component.js';
import { noop } from '../../utilities/no-op.js';
import styles from './link.module.css';
export const Link = createComponent(function ({ children, fullWidth = false, href, onKeyDown = noop, propagateEscapeKeyDown = true, target, ...rest }, ref) {
    const handleKeyDown = useCallback(function (event) {
        onKeyDown(event);
        if (event.key === 'Escape') {
            if (propagateEscapeKeyDown === false) {
                event.stopPropagation();
            }
            event.currentTarget.blur();
        }
    }, [propagateEscapeKeyDown, onKeyDown]);
    return (h("a", { ...rest, ref: ref, class: createClassName([
            styles.link,
            fullWidth === true ? styles.fullWidth : null
        ]), href: href, onKeyDown: handleKeyDown, tabIndex: 0, target: target }, children));
});
//# sourceMappingURL=link.js.map