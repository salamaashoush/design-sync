import rgbHex from 'rgb-hex';
export function convertRgbColorToHexColor(rgbColor) {
    const { r, g, b } = rgbColor;
    if (r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1) {
        return null;
    }
    try {
        return rgbHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)).toUpperCase();
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=convert-rgb-color-to-hex-color.js.map