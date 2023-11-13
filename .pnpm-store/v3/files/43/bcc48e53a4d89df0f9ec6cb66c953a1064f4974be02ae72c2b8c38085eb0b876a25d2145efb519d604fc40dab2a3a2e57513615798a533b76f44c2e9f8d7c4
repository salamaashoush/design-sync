import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../../../components/button/button.js';
import { Textbox } from '../../../components/textbox/textbox/textbox.js';
import { VerticalSpace } from '../../../layout/vertical-space/vertical-space.js';
import { useFocusTrap } from '../use-focus-trap.js';
export default { title: 'Hooks/Use Focus Trap' };
export const UseFocusTrap = function () {
    const [value, setValue] = useState('Text');
    useFocusTrap();
    function handleClick(event) {
        console.log(event);
    }
    return (h(Fragment, null,
        h(Textbox, { name: "text", onValueInput: setValue, value: value, variant: "border" }),
        h(VerticalSpace, { space: "small" }),
        h(Button, { fullWidth: true, onClick: handleClick }, "Submit")));
};
//# sourceMappingURL=use-focus-trap.stories.js.map