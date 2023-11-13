import { h } from 'preact';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { FileUploadButton } from '../file-upload-button.js';
export default {
    tags: ['1'],
    title: 'Components/File Upload Button/Default'
};
export const Passive = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { onSelectedFiles: handleSelectedFiles }, "Text"));
};
export const Focused = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { ...useInitialFocus(), onSelectedFiles: handleSelectedFiles }, "Text"));
};
export const Disabled = function () {
    function handleSelectedFiles() {
        throw new Error('This function should not be called');
    }
    return (h(FileUploadButton, { disabled: true, onSelectedFiles: handleSelectedFiles }, "Text"));
};
export const Loading = function () {
    function handleSelectedFiles() {
        throw new Error('This function should not be called');
    }
    return (h(FileUploadButton, { loading: true, onSelectedFiles: handleSelectedFiles }, "Text"));
};
export const LoadingFocused = function () {
    function handleSelectedFiles() {
        throw new Error('This function should not be called');
    }
    return (h(FileUploadButton, { ...useInitialFocus(), loading: true, onSelectedFiles: handleSelectedFiles }, "Text"));
};
export const LoadingDisabled = function () {
    function handleSelectedFiles() {
        throw new Error('This function should not be called');
    }
    return (h(FileUploadButton, { disabled: true, loading: true, onSelectedFiles: handleSelectedFiles }, "Text"));
};
export const FullWidth = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { fullWidth: true, onSelectedFiles: handleSelectedFiles }, "Text"));
};
FullWidth.parameters = {
    fixedWidth: true
};
export const AcceptedFileTypes = function () {
    const acceptedFileTypes = ['image/x-png', 'image/gif', 'image/jpeg'];
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { acceptedFileTypes: acceptedFileTypes, onSelectedFiles: handleSelectedFiles }, "Text"));
};
export const MultipleFiles = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { multiple: true, onSelectedFiles: handleSelectedFiles }, "Text"));
};
//# sourceMappingURL=file-upload-button-default.stories.js.map