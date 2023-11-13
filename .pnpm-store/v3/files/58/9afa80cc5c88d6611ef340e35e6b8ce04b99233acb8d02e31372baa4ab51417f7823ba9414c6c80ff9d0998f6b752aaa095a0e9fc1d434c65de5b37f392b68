import { h } from 'preact';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { FileUploadButton } from '../file-upload-button.js';
export default {
    tags: ['2'],
    title: 'Components/File Upload Button/Secondary'
};
export const Passive = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
export const Focused = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { ...useInitialFocus(), onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
export const Disabled = function () {
    function handleSelectedFiles() {
        throw new Error('This function should not be called');
    }
    return (h(FileUploadButton, { disabled: true, onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
export const Loading = function () {
    function handleSelectedFiles() {
        throw new Error('This function should not be called');
    }
    return (h(FileUploadButton, { loading: true, onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
export const LoadingFocused = function () {
    function handleSelectedFiles() {
        throw new Error('This function should not be called');
    }
    return (h(FileUploadButton, { ...useInitialFocus(), loading: true, onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
export const LoadingDisabled = function () {
    function handleSelectedFiles() {
        throw new Error('This function should not be called');
    }
    return (h(FileUploadButton, { disabled: true, loading: true, onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
export const FullWidth = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { fullWidth: true, onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
FullWidth.parameters = {
    fixedWidth: true
};
export const AcceptedFileTypes = function () {
    const acceptedFileTypes = ['image/x-png', 'image/gif', 'image/jpeg'];
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { acceptedFileTypes: acceptedFileTypes, onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
export const MultipleFiles = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadButton, { multiple: true, onSelectedFiles: handleSelectedFiles, secondary: true }, "Text"));
};
//# sourceMappingURL=file-upload-button-secondary.stories.js.map