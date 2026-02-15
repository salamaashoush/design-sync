import { SpinnerVariants, spinner } from "./spinner.css";

type SpinnerSize = NonNullable<NonNullable<SpinnerVariants>["size"]>;

interface SpinnerProps {
  size?: SpinnerSize;
}

export function Spinner(props: SpinnerProps) {
  return <div class={spinner({ size: props.size })} role="status" aria-label="Loading" />;
}
