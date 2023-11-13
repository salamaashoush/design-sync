import { MIXED_NUMBER, MIXED_STRING } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import { createClassName } from '../../../utilities/create-class-name.js';
import { createComponent } from '../../../utilities/create-component.js';
import { getCurrentFromRef } from '../../../utilities/get-current-from-ref.js';
import { noop } from '../../../utilities/no-op.js';
import { RawTextboxNumeric } from '../textbox-numeric/private/raw-textbox-numeric.js';
import { createRgbaColor } from './private/create-rgba-color.js';
import { normalizeUserInputColor } from './private/normalize-hex-color.js';
import { updateHexColor } from './private/update-hex-color.js';
import styles from './textbox-color.module.css';
const EMPTY_STRING = '';
export const TextboxColor = createComponent(function ({ disabled = false, hexColor, hexColorPlaceholder, onHexColorInput = noop, onHexColorKeyDown = noop, onHexColorValueInput = noop, onOpacityInput = noop, onOpacityKeyDown = noop, onOpacityNumericValueInput = noop, onOpacityValueInput = noop, onRgbaColorValueInput = noop, opacity, opacityPlaceholder, propagateEscapeKeyDown = true, revertOnEscapeKeyDown = false, variant, ...rest }, ref) {
    const hexColorInputElementRef = useRef(null);
    const opacityInputElementRef = useRef(null);
    const revertOnEscapeKeyDownRef = useRef(false);
    const [originalHexColor, setOriginalHexColor] = useState(EMPTY_STRING);
    const setHexColorInputElementValue = useCallback(function (value) {
        const inputElement = getCurrentFromRef(hexColorInputElementRef);
        inputElement.value = value;
        const inputEvent = new window.Event('input', {
            bubbles: true,
            cancelable: true
        });
        inputElement.dispatchEvent(inputEvent);
    }, []);
    const handleHexColorSelectorFocus = useCallback(function (event) {
        const hexColor = event.currentTarget.value.slice(1).toUpperCase();
        setOriginalHexColor(hexColor);
    }, []);
    const handleHexColorSelectorInput = useCallback(function (event) {
        const hexColor = event.currentTarget.value.slice(1).toUpperCase();
        setHexColorInputElementValue(hexColor);
    }, [setHexColorInputElementValue]);
    const handleHexColorSelectorKeyDown = useCallback(function (event) {
        if (event.key !== 'Escape') {
            return;
        }
        if (revertOnEscapeKeyDown === true) {
            revertOnEscapeKeyDownRef.current = true;
            setHexColorInputElementValue(originalHexColor);
            setOriginalHexColor(EMPTY_STRING);
        }
        if (propagateEscapeKeyDown === false) {
            event.stopPropagation();
        }
        event.currentTarget.blur();
    }, [
        originalHexColor,
        propagateEscapeKeyDown,
        revertOnEscapeKeyDown,
        setHexColorInputElementValue
    ]);
    const handleHexColorBlur = useCallback(function () {
        if (revertOnEscapeKeyDownRef.current === true) {
            revertOnEscapeKeyDownRef.current = false;
            return;
        }
        if (hexColor === EMPTY_STRING) {
            if (originalHexColor !== EMPTY_STRING) {
                setHexColorInputElementValue(originalHexColor);
            }
            setOriginalHexColor(EMPTY_STRING);
            return;
        }
        if (hexColor !== MIXED_STRING) {
            const normalizedHexColor = normalizeUserInputColor(hexColor);
            const newHexColor = normalizedHexColor === null ? originalHexColor : normalizedHexColor;
            if (newHexColor !== hexColor) {
                setHexColorInputElementValue(newHexColor);
            }
        }
        setOriginalHexColor(EMPTY_STRING);
    }, [hexColor, originalHexColor, setHexColorInputElementValue]);
    const handleHexColorFocus = useCallback(function (event) {
        setOriginalHexColor(hexColor);
        event.currentTarget.select();
    }, [hexColor]);
    const handleHexColorInput = useCallback(function (event) {
        onHexColorInput(event);
        const newHexColor = event.currentTarget.value;
        onHexColorValueInput(newHexColor);
        if (newHexColor === EMPTY_STRING) {
            onRgbaColorValueInput(null);
            return;
        }
        const normalizedHexColor = normalizeUserInputColor(newHexColor);
        if (normalizedHexColor === null) {
            onRgbaColorValueInput(null);
            return;
        }
        const rgba = createRgbaColor(normalizedHexColor, opacity);
        onRgbaColorValueInput(rgba);
    }, [onHexColorInput, onHexColorValueInput, onRgbaColorValueInput, opacity]);
    const handleHexColorKeyDown = useCallback(function (event) {
        onHexColorKeyDown(event);
        const key = event.key;
        if (key === 'Escape') {
            if (revertOnEscapeKeyDown === true) {
                revertOnEscapeKeyDownRef.current = true;
                setHexColorInputElementValue(originalHexColor);
                setOriginalHexColor(EMPTY_STRING);
            }
            if (propagateEscapeKeyDown === false) {
                event.stopPropagation();
            }
            event.currentTarget.blur();
            return;
        }
        const element = event.currentTarget;
        if (key === 'ArrowDown' || key === 'ArrowUp') {
            event.preventDefault();
            const delta = event.shiftKey === true ? 10 : 1;
            const startingHexColor = hexColor === EMPTY_STRING || hexColor === MIXED_STRING
                ? key === 'ArrowDown'
                    ? 'FFFFFF'
                    : '000000'
                : hexColor;
            const newHexColor = updateHexColor(startingHexColor, key === 'ArrowDown' ? -1 * delta : delta);
            setHexColorInputElementValue(newHexColor);
            element.select();
            return;
        }
        if (event.ctrlKey === true || event.metaKey === true) {
            return;
        }
    }, [
        hexColor,
        onHexColorKeyDown,
        originalHexColor,
        propagateEscapeKeyDown,
        revertOnEscapeKeyDown,
        setHexColorInputElementValue
    ]);
    const handleHexColorMouseUp = useCallback(function (event) {
        if (hexColor !== MIXED_STRING) {
            return;
        }
        event.preventDefault();
    }, [hexColor]);
    const handleOpacityInput = useCallback(function (event) {
        onOpacityInput(event);
        const newOpacity = event.currentTarget.value;
        const rgba = createRgbaColor(hexColor, newOpacity);
        onRgbaColorValueInput(rgba);
    }, [hexColor, onOpacityInput, onRgbaColorValueInput]);
    const handleOpacityNumericValueInput = useCallback(function (opacity) {
        onOpacityNumericValueInput(opacity === null || opacity === MIXED_NUMBER ? opacity : opacity / 100);
    }, [onOpacityNumericValueInput]);
    const validateOpacityOnBlur = useCallback(function (opacity) {
        return opacity !== null;
    }, []);
    const parsedOpacity = parseOpacity(opacity);
    const isHexColorValid = hexColor !== EMPTY_STRING && hexColor !== MIXED_STRING;
    const normalizedHexColor = isHexColorValid === true ? normalizeUserInputColor(hexColor) : 'FFFFFF';
    const renderedHexColor = normalizedHexColor === null ? originalHexColor : normalizedHexColor;
    return (h("div", { ref: ref, class: createClassName([
            styles.textboxColor,
            typeof variant === 'undefined'
                ? null
                : variant === 'border'
                    ? styles.hasBorder
                    : null,
            disabled === true ? styles.disabled : null
        ]) },
        h("div", { class: styles.color },
            h("div", { class: styles.colorFill, style: isHexColorValid === true
                    ? { backgroundColor: `#${renderedHexColor}` }
                    : {} }),
            parsedOpacity === 1 ? null : (h("div", { class: styles.colorFill, style: isHexColorValid === true
                    ? {
                        backgroundColor: `#${renderedHexColor}`,
                        opacity: parsedOpacity
                    }
                    : {} })),
            h("div", { class: styles.colorBorder })),
        h("input", { class: styles.hexColorSelector, disabled: disabled === true, onFocus: handleHexColorSelectorFocus, onInput: handleHexColorSelectorInput, onKeyDown: handleHexColorSelectorKeyDown, tabIndex: -1, type: "color", value: `#${renderedHexColor}` }),
        h("input", { ...rest, ref: hexColorInputElementRef, class: createClassName([styles.input, styles.hexColorInput]), disabled: disabled === true, onBlur: handleHexColorBlur, onFocus: handleHexColorFocus, onInput: handleHexColorInput, onKeyDown: handleHexColorKeyDown, onMouseUp: handleHexColorMouseUp, placeholder: hexColorPlaceholder, spellcheck: false, tabIndex: 0, type: "text", value: hexColor === MIXED_STRING ? 'Mixed' : hexColor }),
        h(RawTextboxNumeric, { ref: opacityInputElementRef, class: createClassName([styles.input, styles.opacityInput]), disabled: disabled === true, maximum: 100, minimum: 0, onInput: handleOpacityInput, onKeyDown: onOpacityKeyDown, onNumericValueInput: handleOpacityNumericValueInput, onValueInput: onOpacityValueInput, placeholder: opacityPlaceholder, propagateEscapeKeyDown: propagateEscapeKeyDown, revertOnEscapeKeyDown: revertOnEscapeKeyDown, suffix: "%", validateOnBlur: validateOpacityOnBlur, value: opacity }),
        h("div", { class: styles.divider }),
        h("div", { class: styles.border }),
        variant === 'underline' ? h("div", { class: styles.underline }) : null));
});
function parseOpacity(opacity) {
    if (opacity === MIXED_STRING || opacity === EMPTY_STRING) {
        return 1;
    }
    return parseInt(opacity, 10) / 100;
}
//# sourceMappingURL=textbox-color.js.map