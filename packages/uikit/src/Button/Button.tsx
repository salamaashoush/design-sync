import { Button as KButton } from '@kobalte/core';
import { ComponentProps, splitProps } from 'solid-js';
import { ButtonVariants, button } from './button.css';

type ButtonProps = ComponentProps<'button'> & ButtonVariants;

export function Button(props: ButtonProps) {
  const [variants, rest] = splitProps(props, ['intent', 'destructive']);
  return <KButton.Root {...rest} disabled={props.disabled} class={button(variants)} />;
}
