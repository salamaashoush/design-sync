import { h } from 'preact';
import { useInitialFocus } from '../../../../hooks/use-initial-focus/use-initial-focus.js';
import { Muted } from '../../../../inline-text/muted/muted.js';
import { Text } from '../../../text/text.js';
import { FileUploadDropzone } from '../file-upload-dropzone.js';
export default {
    parameters: {
        fixedWidth: true
    },
    title: 'Components/File Upload Dropzone'
};
export const Passive = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadDropzone, { onSelectedFiles: handleSelectedFiles },
        h(Text, { align: "center" },
            h(Muted, null, "Text"))));
};
export const Focused = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadDropzone, { ...useInitialFocus(), onSelectedFiles: handleSelectedFiles },
        h(Text, { align: "center" },
            h(Muted, null, "Text"))));
};
export const AcceptedFileTypes = function () {
    const acceptedFileTypes = ['image/x-png', 'image/gif', 'image/jpeg'];
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadDropzone, { acceptedFileTypes: acceptedFileTypes, onSelectedFiles: handleSelectedFiles },
        h(Text, { align: "center" },
            h(Muted, null, "Text"))));
};
export const MultipleFiles = function () {
    function handleSelectedFiles(files) {
        console.log(files);
    }
    return (h(FileUploadDropzone, { multiple: true, onSelectedFiles: handleSelectedFiles },
        h(Text, { align: "center" },
            h(Muted, null, "Text"))));
};
//# sourceMappingURL=file-upload-dropzone.stories.js.map