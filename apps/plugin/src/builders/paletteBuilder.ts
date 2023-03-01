import tinyColor from 'tinycolor2';

type TinyColor = tinyColor.Instance;
export const weights = ['900', '800', '700', '600', '500', '400', '300', '200', '100', '075', '050', '025', '015'];

export const bases = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  neutralCool: 'neutral-cool',
  neutral: 'neutral',
};

export const shadowTarget = { light: 0.35, medium: 0.3, dark: 0.25 };
export const highlightTarget = { light: 98, medium: 97, dark: 95 };

export class PaletteBuilder {
  constructor(private paperWhite = highlightTarget.light, private shadeTargetMultiplier = shadowTarget.light) {}

  createSwatchRow(colorStr: string) {
    const color = tinyColor(colorStr);
    const shadeTargets = this.createShadeTargets(color);
    const tintTargets = this.createTintTargets(color);

    const swatch900 = this.darkenToTarget(color.clone().saturate(10), shadeTargets.L_900);
    const swatch800 = this.darkenToTarget(color.clone().saturate(5), shadeTargets.L_800);
    const swatch700 = this.darkenToTarget(color.clone().saturate(3), shadeTargets.L_700);
    const swatch600 = this.darkenToTarget(color.clone().saturate(2), shadeTargets.L_600);
    const swatch500 = this.darkenToTarget(color.clone().saturate(0), shadeTargets.L_500);
    const swatch400 = color;
    const swatch300 = this.lightenToTarget(color.clone().saturate(0), tintTargets.L_300);
    const swatch200 = this.lightenToTarget(color.clone().saturate(0), tintTargets.L_200);
    const swatch100 = this.lightenToTarget(color.clone().saturate(0), tintTargets.L_100);
    const swatch075 = this.lightenToTarget(color.clone().saturate(3), tintTargets.L_075);
    const swatch050 = this.lightenToTarget(color.clone().saturate(5), tintTargets.L_050);
    const swatch025 = this.lightenToTarget(color.clone().saturate(10), tintTargets.L_025);
    const swatch015 = this.lightenToTarget(color.clone().saturate(15), tintTargets.L_015);

    return {
      swatch900: swatch900.toHexString(),
      swatch800: swatch800.toHexString(),
      swatch700: swatch700.toHexString(),
      swatch600: swatch600.toHexString(),
      swatch500: swatch500.toHexString(),
      swatch400: swatch400.toHexString(),
      swatch300: swatch300.toHexString(),
      swatch200: swatch200.toHexString(),
      swatch100: swatch100.toHexString(),
      swatch075: swatch075.toHexString(),
      swatch050: swatch050.toHexString(),
      swatch025: swatch025.toHexString(),
      swatch015: swatch015.toHexString(),
    };
  }

  getLightnessValue(color: TinyColor) {
    return color.toHsl().l * 100;
  }

  darken(color: TinyColor) {
    return color.clone().darken(1);
  }

  lighten(color: TinyColor) {
    return color.clone().lighten(1);
  }

  darkenToTarget(color: TinyColor, targetValue: number) {
    let result = color.clone();

    while (this.getLightnessValue(result) > targetValue) {
      result = this.darken(result);
    }

    return result;
  }

  lightenToTarget(color: TinyColor, targetValue: number) {
    let result = color.clone();

    while (this.getLightnessValue(result) < targetValue) {
      result = this.lighten(result);
    }

    return result;
  }

  createShadeTargets(base: TinyColor) {
    const L_400 = this.getLightnessValue(base);
    const L_900 = L_400 * this.shadeTargetMultiplier;

    const stepValue = (L_400 - L_900) / 5;

    const L_800 = L_900 + stepValue * 1;
    const L_700 = L_900 + stepValue * 2;
    const L_600 = L_900 + stepValue * 3;
    const L_500 = L_900 + stepValue * 4;

    return {
      L_900: L_900,
      L_800: L_800,
      L_700: L_700,
      L_600: L_600,
      L_500: L_500,
    };
  }

  createTintTargets(base: TinyColor) {
    const L_400 = this.getLightnessValue(base);

    const stepValue = (this.paperWhite - L_400) / 6;

    const L_300 = L_400 + stepValue * 1;
    const L_200 = L_400 + stepValue * 2;
    const L_100 = L_400 + stepValue * 3;
    const L_075 = L_400 + stepValue * 4;
    const L_050 = L_400 + stepValue * 5;

    // Want a tint between 050 and 015
    let L_025 = (L_050 - this.paperWhite) / 2 + this.paperWhite;
    // if *L value not equal to paperWhite, make slightly lighter
    if (L_025 + 2 >= this.paperWhite) {
      L_025 = L_025;
    } else {
      L_025 = L_025 + 1;
    }

    return {
      L_300: L_300,
      L_200: L_200,
      L_100: L_100,
      L_075: L_075,
      L_050: L_050,
      L_025: L_025,
      L_015: this.paperWhite,
    };
  }

  isDark(color: TinyColor) {
    return color.isDark();
  }
}
