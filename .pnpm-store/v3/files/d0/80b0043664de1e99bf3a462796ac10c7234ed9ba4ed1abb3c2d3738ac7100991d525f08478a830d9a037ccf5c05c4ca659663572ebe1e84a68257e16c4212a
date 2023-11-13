import { invalidCharactersRegex, numbersRegex, operatorRegex, operatorSuffixRegex } from './private/regex.js';
export function evaluateNumericExpression(value) {
    if (value === '' ||
        numbersRegex.test(value) === false ||
        invalidCharactersRegex.test(value) === true) {
        return null;
    }
    if (operatorRegex.test(value) === true) {
        if (operatorSuffixRegex.test(value) === true) {
            return eval(value.substring(0, value.length - 1));
        }
        return eval(value);
    }
    return parseFloat(value);
}
//# sourceMappingURL=evaluate-numeric-expression.js.map