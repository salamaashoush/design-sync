import { JSX, ParentProps } from 'solid-js';

interface OnboardingTipProps {
  icon?: JSX.Element;
}
export function OnboardingTip(props: ParentProps<OnboardingTipProps>) {
  return (
    <div class="onboarding-tip">
      {props.icon}
      <div class="onboarding-tip__msg">{props.children}</div>
    </div>
  );
}
