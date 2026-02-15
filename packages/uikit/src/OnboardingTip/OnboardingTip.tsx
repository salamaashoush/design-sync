import { JSX, ParentProps } from "solid-js";
import * as styles from "./onboardingTip.css";

interface OnboardingTipProps {
  icon?: JSX.Element;
}
export function OnboardingTip(props: ParentProps<OnboardingTipProps>) {
  return (
    <div class={styles.root}>
      {props.icon}
      <div class={styles.message}>{props.children}</div>
    </div>
  );
}
