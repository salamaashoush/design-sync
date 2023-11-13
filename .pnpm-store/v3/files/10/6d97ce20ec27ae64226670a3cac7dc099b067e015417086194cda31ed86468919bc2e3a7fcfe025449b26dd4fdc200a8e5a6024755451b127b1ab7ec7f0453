/**
 * An explicit form error with useful information for the user.
 */
export class FormError extends Error {
    name = 'FormError';
    errors;
    constructor(arg1, arg2) {
        super(typeof arg1 === 'string' ? arg1 : '');
        this.errors = typeof arg1 === 'string' ? arg2 || {} : arg1;
    }
}
