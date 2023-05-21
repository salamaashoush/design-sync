import { Checkbox, Collapsible } from '@tokenize/uikit';

export function CheckboxExample() {
  return (
    <Collapsible title="Checkbox">
      <Checkbox label="Checkbox" />
      <Checkbox label="Checkbox" checked />
      <Checkbox label="Checkbox" indeterminate />
      <Checkbox label="Checkbox" disabled />
      <Checkbox label="Checkbox" checked disabled />
    </Collapsible>
  );
}
