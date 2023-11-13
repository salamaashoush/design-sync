import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { createComponent } from '../../utilities/create-component.js';
import { noop } from '../../utilities/no-op.js';
import { ITEM_ID_DATA_ATTRIBUTE_NAME } from '../../utilities/private/constants.js';
import styles from './tabs.module.css';
export const Tabs = createComponent(function ({ onChange = noop, onKeyDown = noop, onValueChange = noop, options, propagateEscapeKeyDown = true, value, ...rest }, ref) {
    const handleChange = useCallback(function (event) {
        onChange(event);
        const id = event.currentTarget.getAttribute(ITEM_ID_DATA_ATTRIBUTE_NAME);
        if (id === null) {
            throw new Error('`id` is `null`');
        }
        const newValue = options[parseInt(id, 10)].value;
        onValueChange(newValue);
    }, [onChange, onValueChange, options]);
    const handleKeyDown = useCallback(function (event) {
        onKeyDown(event);
        if (event.key === 'Escape') {
            if (propagateEscapeKeyDown === false) {
                event.stopPropagation();
            }
            event.currentTarget.blur();
        }
    }, [onKeyDown, propagateEscapeKeyDown]);
    const activeOption = options.find(function (option) {
        return option.value === value;
    });
    return (h(Fragment, null,
        h("div", { ref: ref, class: styles.tabs }, options.map(function (option, index) {
            return (h("label", { key: index, class: styles.label },
                h("input", { ...rest, checked: value === option.value, class: styles.input, onChange: handleChange, onKeyDown: handleKeyDown, tabIndex: 0, type: "radio", value: option.value, [ITEM_ID_DATA_ATTRIBUTE_NAME]: `${index}` }),
                h("div", { class: styles.value }, option.value)));
        })),
        typeof activeOption === 'undefined' ? null : (h("div", { class: styles.children }, activeOption.children))));
});
//# sourceMappingURL=tabs.js.map