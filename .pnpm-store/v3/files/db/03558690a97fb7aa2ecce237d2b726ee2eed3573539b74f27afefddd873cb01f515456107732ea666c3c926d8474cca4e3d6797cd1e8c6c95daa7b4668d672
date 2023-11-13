export async function loadFontsAsync(nodes) {
    const result = {};
    for (const node of nodes) {
        switch (node.type) {
            case 'CONNECTOR':
            case 'SHAPE_WITH_TEXT':
            case 'STICKY': {
                collectFontsUsedInNode(node.text, result);
                break;
            }
            case 'TEXT': {
                collectFontsUsedInNode(node, result);
                break;
            }
        }
    }
    await Promise.all(Object.values(result).map(function (font) {
        return figma.loadFontAsync(font);
    }));
}
function collectFontsUsedInNode(node, result) {
    const length = node.characters.length;
    if (length === 0) {
        const fontName = node.fontName;
        const key = createKey(fontName);
        if (key in result) {
            return;
        }
        result[key] = fontName;
        return;
    }
    let i = -1;
    while (++i < length) {
        const fontName = node.getRangeFontName(i, i + 1);
        const key = createKey(fontName);
        if (key in result) {
            continue;
        }
        result[key] = fontName;
    }
}
function createKey(fontName) {
    return `${fontName.family}-${fontName.style}`;
}
//# sourceMappingURL=load-fonts-async.js.map