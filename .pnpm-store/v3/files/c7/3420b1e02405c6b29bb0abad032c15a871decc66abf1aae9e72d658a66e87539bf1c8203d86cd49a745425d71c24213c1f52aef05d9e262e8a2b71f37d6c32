import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { createClassName } from '../../../utilities/create-class-name.js';
import { createComponent } from '../../../utilities/create-component.js';
import { noop } from '../../../utilities/no-op.js';
import { fileComparator } from '../private/file-comparator.js';
import styles from './file-upload-dropzone.module.css';
export const FileUploadDropzone = createComponent(function ({ acceptedFileTypes = [], children, multiple = false, onBlur = noop, onChange = noop, onDragEnd = noop, onDragEnter = noop, onDragOver = noop, onDrop = noop, onKeyDown = noop, onSelectedFiles = noop, propagateEscapeKeyDown = true, ...rest }, ref) {
    const [isDropActive, setIsDropActive] = useState(false);
    const handleBlur = useCallback(function (event) {
        onBlur(event);
        setIsDropActive(false);
    }, [onBlur]);
    const handleChange = useCallback(function (event) {
        onChange(event);
        const fileList = event.currentTarget.files;
        if (fileList === null) {
            throw new Error('`event.currentTarget.files` is `null`');
        }
        const files = parseFileList({ acceptedFileTypes, fileList });
        if (files.length > 0) {
            onSelectedFiles(files);
        }
    }, [acceptedFileTypes, onChange, onSelectedFiles]);
    const handleDragEnter = useCallback(function (event) {
        onDragEnter(event);
        event.preventDefault();
    }, [onDragEnter]);
    const handleDragOver = useCallback(function (event) {
        onDragOver(event);
        event.preventDefault();
        setIsDropActive(true);
    }, [onDragOver]);
    const handleDragEnd = useCallback(function (event) {
        onDragEnd(event);
        event.preventDefault();
        setIsDropActive(false);
    }, [onDragEnd]);
    const handleDrop = useCallback(function (event) {
        onDrop(event);
        if (event.dataTransfer === null) {
            throw new Error('`event.dataTransfer` is `null`');
        }
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        const files = parseFileList({ acceptedFileTypes, fileList });
        if (files.length > 0) {
            onSelectedFiles(files);
        }
        setIsDropActive(false);
    }, [acceptedFileTypes, onDrop, onSelectedFiles]);
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
            styles.fileUploadDropzone,
            isDropActive === true ? styles.isDropActive : null
        ]) },
        h("input", { ...rest, ref: ref, accept: acceptedFileTypes.length === 0
                ? undefined
                : acceptedFileTypes.join(','), class: styles.input, multiple: multiple, onBlur: handleBlur, onChange: handleChange, onDragEnd: handleDragEnd, onDragEnter: handleDragEnter, onDragOver: handleDragOver, onDrop: handleDrop, onKeyDown: handleKeyDown, tabIndex: 0, title: "", type: "file" }),
        h("div", { class: styles.fill }),
        h("div", { class: styles.border }),
        h("div", { class: styles.children }, children)));
});
function parseFileList(options) {
    const { fileList, acceptedFileTypes } = options;
    const result = Array.prototype.slice.call(fileList).sort(fileComparator);
    if (acceptedFileTypes.length === 0) {
        return result;
    }
    return result.filter(function (file) {
        return acceptedFileTypes.indexOf(file.type) !== -1;
    });
}
//# sourceMappingURL=file-upload-dropzone.js.map