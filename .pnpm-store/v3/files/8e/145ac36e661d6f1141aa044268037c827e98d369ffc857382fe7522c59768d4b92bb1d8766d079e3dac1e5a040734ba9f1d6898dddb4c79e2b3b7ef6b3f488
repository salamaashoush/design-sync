import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { createClassName } from '../../../utilities/create-class-name.js';
import { createComponent } from '../../../utilities/create-component.js';
import { noop } from '../../../utilities/no-op.js';
import buttonStyles from '../../button/button.module.css';
import { LoadingIndicator } from '../../loading-indicator/loading-indicator.js';
import { fileComparator } from '../private/file-comparator.js';
import fileUploadButtonStyles from './file-upload-button.module.css';
export const FileUploadButton = createComponent(function ({ acceptedFileTypes = [], children, disabled = false, fullWidth = false, loading = false, multiple = false, onChange = noop, onClick = noop, onKeyDown = noop, onMouseDown = noop, onSelectedFiles = noop, propagateEscapeKeyDown = true, secondary = false, ...rest }, ref) {
    const handleChange = useCallback(function (event) {
        onChange(event);
        const fileList = event.currentTarget.files;
        if (fileList === null) {
            throw new Error('`event.currentTarget.files` is `null`');
        }
        const files = parseFileList(fileList);
        if (files.length > 0) {
            onSelectedFiles(files);
        }
    }, [onChange, onSelectedFiles]);
    const handleClick = useCallback(function (event) {
        onClick(event);
        if (loading === true) {
            event.preventDefault();
        }
    }, [onClick, loading]);
    const handleMouseDown = useCallback(function (event) {
        onMouseDown(event);
        event.currentTarget.focus();
    }, [onMouseDown]);
    const handleKeyDown = useCallback(function (event) {
        onKeyDown(event);
        if (event.key === 'Escape') {
            if (propagateEscapeKeyDown === false) {
                event.stopPropagation();
            }
            event.currentTarget.blur();
        }
    }, [onKeyDown, propagateEscapeKeyDown]);
    return (h("div", { class: createClassName([
            buttonStyles.button,
            secondary === true ? buttonStyles.secondary : buttonStyles.default,
            secondary === true
                ? fileUploadButtonStyles.secondary
                : fileUploadButtonStyles.default,
            fullWidth === true ? buttonStyles.fullWidth : null,
            disabled === true ? buttonStyles.disabled : null,
            disabled === true ? fileUploadButtonStyles.disabled : null,
            loading === true ? buttonStyles.loading : null
        ]) },
        loading === true ? (h("div", { class: buttonStyles.loadingIndicator },
            h(LoadingIndicator, null))) : null,
        h("input", { ...rest, ref: ref, accept: acceptedFileTypes.length === 0
                ? undefined
                : acceptedFileTypes.join(','), class: fileUploadButtonStyles.input, disabled: disabled === true, multiple: multiple, onChange: handleChange, onClick: handleClick, onKeyDown: handleKeyDown, onMouseDown: handleMouseDown, tabIndex: 0, title: "", type: "file" }),
        h("button", { disabled: disabled === true, tabIndex: -1 },
            h("div", { class: buttonStyles.children }, children))));
});
function parseFileList(fileList) {
    return Array.prototype.slice.call(fileList).sort(fileComparator);
}
//# sourceMappingURL=file-upload-button.js.map