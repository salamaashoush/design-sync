export async function readBytesFromCanvasElementAsync(canvasElement) {
    return new Promise(function (resolve, reject) {
        canvasElement.toBlob(function (blob) {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(new Uint8Array(reader.result));
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    });
}
//# sourceMappingURL=read-bytes-from-canvas-element-async.js.map