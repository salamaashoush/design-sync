import { ParentProps } from "solid-js";
import { BadgeVariants, badge } from "./badge.css";

type BadgeIntent = NonNullable<NonNullable<BadgeVariants>["intent"]>;

interface BadgeProps extends ParentProps {
  intent?: BadgeIntent;
}

export function Badge(props: BadgeProps) {
  return <span class={badge({ intent: props.intent })}>{props.children}</span>;
}
