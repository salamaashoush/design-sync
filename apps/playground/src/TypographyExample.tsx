import { ui11, ui11Bold, ui11Medium } from '@tokenize/design-tokens';
import { Collapsible, Label, SectionTitle } from '@tokenize/uikit';

export function TypographyExample() {
  return (
    <Collapsible title="Typography">
      <Label>Label</Label>
      <SectionTitle>Section Title</SectionTitle>

      <div class={ui11}>UI11</div>
      <div class={ui11Medium}>UI11 medium</div>
      <div class={ui11Bold}>UI11 bold</div>
    </Collapsible>
  );
}
