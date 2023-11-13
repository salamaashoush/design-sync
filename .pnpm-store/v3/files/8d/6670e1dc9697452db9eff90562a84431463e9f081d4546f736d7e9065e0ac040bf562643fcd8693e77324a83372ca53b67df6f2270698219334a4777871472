export function ensureMinimumTime(minimumTime, callback) {
    return async function (...args) {
        const startTimestamp = Date.now();
        const result = await callback(...args);
        const elapsedTime = Date.now() - startTimestamp;
        if (elapsedTime >= minimumTime) {
            return result;
        }
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(result);
            }, minimumTime - elapsedTime);
        });
    };
}
//# sourceMappingURL=ensure-minimum-time.js.map