import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../../../components/button/button.js';
import { Textbox } from '../../../components/textbox/textbox/textbox.js';
import { VerticalSpace } from '../../../layout/vertical-space/vertical-space.js';
import { useInitialFocus } from '../use-initial-focus.js';
export default { title: 'Hooks/Use Initial Focus' };
export const UseInitialFocus = function () {
    const [value, setValue] = useState('Text');
    const initialFocus = useInitialFocus();
    function handleClick(event) {
        console.log(event);
    }
    return (h(Fragment, null,
        h(Textbox, { ...initialFocus, name: "text", onValueInput: setValue, value: value, variant: "border" }),
        h(VerticalSpace, { space: "small" }),
        h(Button, { fullWidth: true, onClick: handleClick }, "Submit")));
};
//# sourceMappingURL=use-initial-focus.stories.js.map