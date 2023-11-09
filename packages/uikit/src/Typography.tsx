import { label, sectionTitle } from '@design-sync/design-tokens';
import { ComponentProps } from 'solid-js';

export function Label(props: ComponentProps<'div'>) {
  return <div {...props} class={label} />;
}

export function SectionTitle(props: ComponentProps<'div'>) {
  return <div {...props} class={sectionTitle} />;
}
