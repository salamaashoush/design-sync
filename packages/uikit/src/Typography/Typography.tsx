import { ComponentProps } from 'solid-js';
import { label, sectionTitle } from './typography.css';

export function Label(props: ComponentProps<'div'>) {
  return <div {...props} class={label} />;
}

export function SectionTitle(props: ComponentProps<'div'>) {
  return <div {...props} class={sectionTitle} />;
}
