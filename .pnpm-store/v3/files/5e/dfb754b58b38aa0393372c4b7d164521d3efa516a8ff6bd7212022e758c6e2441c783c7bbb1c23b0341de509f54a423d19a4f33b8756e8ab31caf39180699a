import hexRgb from 'hex-rgb';
export function convertHexColorToRgbColor(hexColor) {
    if (hexColor.length !== 3 && hexColor.length !== 6) {
        return null;
    }
    try {
        const { red, green, blue } = hexRgb(hexColor);
        return {
            b: blue / 255,
            g: green / 255,
            r: red / 255
        };
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=convert-hex-color-to-rgb-color.js.map