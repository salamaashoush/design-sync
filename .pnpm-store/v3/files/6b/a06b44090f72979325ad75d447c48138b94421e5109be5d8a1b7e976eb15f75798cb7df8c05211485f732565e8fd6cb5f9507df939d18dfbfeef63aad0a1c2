export async function createImageElementFromBlobAsync(blob) {
    return new Promise(function (resolve, reject) {
        const imageElement = new Image();
        imageElement.onload = function () {
            resolve(imageElement);
        };
        imageElement.onerror = reject;
        imageElement.src = URL.createObjectURL(blob);
    });
}
//# sourceMappingURL=create-image-element-from-blob-async.js.map