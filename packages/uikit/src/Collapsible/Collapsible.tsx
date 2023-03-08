import { Collapsible as KCollapsible } from '@kobalte/core';
import { JSX, ParentProps } from 'solid-js';
import {
  collapsible,
  collapsibleCaret,
  collapsibleCaretIcon,
  collapsibleContent,
  collapsibleHeader,
  collapsibleLabel,
} from './collapsible.css';

interface CollapsibleProps extends KCollapsible.CollapsibleRootOptions {
  title: string;
  section?: boolean;
  control?: JSX.Element;
}
export function Collapsible(props: ParentProps<CollapsibleProps>) {
  return (
    <KCollapsible.Root
      class={collapsible}
      isDisabled={props.isDisabled}
      defaultIsOpen={props.defaultIsOpen}
      onOpenChange={props.onOpenChange}
      isOpen={props.isOpen}
      forceMount={props.forceMount}
    >
      <div class={collapsibleHeader}>
        <KCollapsible.Trigger data-section={props.section} class={collapsibleLabel}>
          <span class={collapsibleCaret}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="6"
              viewBox="0 0 4 6"
              fill="none"
              class={collapsibleCaretIcon}
            >
              <path d="M4 3L0 0V6L4 3Z" fill="currentColor" />
            </svg>
          </span>

          {props.title}
        </KCollapsible.Trigger>
        {props.control}
      </div>

      <KCollapsible.Content class={collapsibleContent}>{props.children}</KCollapsible.Content>
    </KCollapsible.Root>
  );
}
