import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { Button } from '../../../components/button/button.js';
import { Text } from '../../../components/text/text.js';
import { Textbox } from '../../../components/textbox/textbox/textbox.js';
import { VerticalSpace } from '../../../layout/vertical-space/vertical-space.js';
import { useForm } from '../use-form.js';
export default { title: 'Hooks/Use Form' };
export const UseForm = function () {
    const { disabled, formState, handleSubmit, initialFocus, setFormState } = useForm({ text: '', wordCount: 0 }, {
        close: function (formState) {
            console.log('close', formState);
        },
        submit: function (formState) {
            console.log('submit', formState);
        },
        transform: function (formState) {
            console.log('transform', formState);
            const trimmed = formState.text.trim();
            return {
                ...formState,
                wordCount: trimmed === '' ? 0 : trimmed.split(' ').length
            };
        },
        validate: function (formState) {
            console.log('validate', formState);
            return formState.wordCount > 1;
        }
    });
    const handleValueInput = useCallback(function (text) {
        setFormState(text, 'text');
    }, [setFormState]);
    return (h(Fragment, null,
        h(Textbox, { ...initialFocus, onValueInput: handleValueInput, value: formState.text, variant: "border" }),
        h(VerticalSpace, { space: "small" }),
        h(Text, { align: "center" },
            formState.wordCount,
            " word",
            formState.wordCount === 1 ? '' : 's'),
        h(VerticalSpace, { space: "small" }),
        h(Button, { disabled: disabled === true, fullWidth: true, onClick: handleSubmit }, "Submit")));
};
//# sourceMappingURL=use-form.stories.js.map