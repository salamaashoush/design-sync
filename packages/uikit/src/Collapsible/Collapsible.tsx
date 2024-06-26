import { CaretRight16Icon } from '@design-sync/figma-icons';
import { Collapsible as KCollapsible } from '@kobalte/core';
import { ComponentProps, JSX, ParentProps } from 'solid-js';
import {
  collapsible,
  collapsibleCaret,
  collapsibleContent,
  collapsibleHeader,
  collapsibleLabel,
} from './collapsible.css';

interface CollapsibleProps extends ComponentProps<typeof KCollapsible.Root> {
  title: string;
  section?: boolean;
  control?: JSX.Element;
}
export function Collapsible(props: ParentProps<CollapsibleProps>) {
  return (
    <KCollapsible.Root
      class={collapsible}
      disabled={props.disabled}
      defaultOpen={props.defaultOpen}
      onOpenChange={props.onOpenChange}
      open={props.open}
      forceMount={props.forceMount}
    >
      <div class={collapsibleHeader}>
        <KCollapsible.Trigger data-section={props.section} class={collapsibleLabel}>
          <CaretRight16Icon class={collapsibleCaret} />
          {props.title}
        </KCollapsible.Trigger>
        {props.control}
      </div>

      <KCollapsible.Content class={collapsibleContent}>{props.children}</KCollapsible.Content>
    </KCollapsible.Root>
  );
}
