import { Label, SectionTitle, ui11, ui11Bold, ui11Medium } from '@tokenize/uikit';

export function TypographyExample() {
  return (
    <div>
      <h1>Typography</h1>
      <Label>Label</Label>
      <SectionTitle>Section Title</SectionTitle>

      <div class={ui11}>UI11</div>
      <div class={ui11Medium}>UI11 medium</div>
      <div class={ui11Bold}>UI11 bold</div>
    </div>
  );
}
