import { RenderableProps } from 'preact';
import { badgeStyle } from './badge.css.ts';
export interface BadgeProps {
  color?: string;
}
export function Badge({ children }: RenderableProps<unknown>) {
  return <span className={badgeStyle}>{children}</span>;
}
