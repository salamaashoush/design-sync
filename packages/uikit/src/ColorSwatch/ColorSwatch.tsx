import { SwatchVariants, checkerboard, colorFill, swatch } from './colorSwatch.css';

type SwatchSize = NonNullable<NonNullable<SwatchVariants>['size']>;

interface ColorSwatchProps {
  color: string;
  size?: SwatchSize;
}

export function ColorSwatch(props: ColorSwatchProps) {
  return (
    <div class={swatch({ size: props.size })}>
      <div class={checkerboard} />
      <div class={colorFill} style={{ 'background-color': props.color }} />
    </div>
  );
}
