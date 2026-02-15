import { ParentProps } from "solid-js";

interface ThemeProviderProps {
  theme: string;
}

export function ThemeProvider(props: ParentProps<ThemeProviderProps>) {
  return <div class={props.theme}>{props.children}</div>;
}
