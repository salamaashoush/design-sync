import { JSX, Show } from "solid-js";
import {
  description as descriptionClass,
  icon as iconClass,
  root,
  title as titleClass,
} from "./emptyState.css";

interface EmptyStateProps {
  icon?: JSX.Element;
  title: string;
  description?: string;
  action?: JSX.Element;
}

export function EmptyState(props: EmptyStateProps) {
  return (
    <div class={root}>
      <Show when={props.icon}>
        <div class={iconClass}>{props.icon}</div>
      </Show>
      <div class={titleClass}>{props.title}</div>
      <Show when={props.description}>
        <div class={descriptionClass}>{props.description}</div>
      </Show>
      <Show when={props.action}>{props.action}</Show>
    </div>
  );
}
