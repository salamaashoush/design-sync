import { yellow } from 'kleur/colors';
export function trackElapsedTime() {
    const time = process.hrtime();
    return function () {
        const elapsedTime = process.hrtime(time);
        const duration = elapsedTime[0] + elapsedTime[1] / 1e9;
        return yellow(`${duration.toFixed(3)}s`);
    };
}
//# sourceMappingURL=track-elapsed-time.js.map