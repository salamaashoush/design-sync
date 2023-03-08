import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// Positive
export const ui11 = style({
  fontFamily: vars.fontFamily.main,
  fontSize: vars.fontSize.ui11,
  fontWeight: vars.fontWeight.regular,
  lineHeight: vars.lineHeight.sm,
  letterSpacing: vars.letterSpacing.ui11,
});
export const ui11Medium = style([ui11, { fontWeight: vars.fontWeight.medium }]);
export const ui11Bold = style([ui11, { fontWeight: vars.fontWeight.bold }]);

export const ui12 = style({
  fontFamily: vars.fontFamily.main,
  fontSize: vars.fontSize.ui12,
  fontWeight: vars.fontWeight.regular,
  lineHeight: vars.lineHeight.sm,
  letterSpacing: vars.letterSpacing.ui12,
});
export const ui12Medium = style([ui12, { fontWeight: vars.fontWeight.medium }]);
export const ui12Bold = style([ui12, { fontWeight: vars.fontWeight.bold }]);

export const ui13 = style({
  fontFamily: vars.fontFamily.main,
  fontSize: vars.fontSize.ui13,
  fontWeight: vars.fontWeight.regular,
  lineHeight: vars.lineHeight.lg,
  letterSpacing: vars.letterSpacing.ui13,
});
export const ui13Medium = style([ui13, { fontWeight: vars.fontWeight.medium }]);
export const ui13Bold = style([ui13, { fontWeight: vars.fontWeight.bold }]);

export const ui14 = style({
  fontFamily: vars.fontFamily.main,
  fontSize: vars.fontSize.ui14,
  fontWeight: vars.fontWeight.regular,
  lineHeight: vars.lineHeight.lg,
  letterSpacing: vars.letterSpacing.ui14,
});

export const ui14Medium = style([ui14, { fontWeight: vars.fontWeight.medium }]);
export const ui14Bold = style([ui14, { fontWeight: vars.fontWeight.bold }]);

// Negative
export const ui11Neg = style([ui11, { letterSpacing: vars.letterSpacing.ui11Neg }]);
export const ui11MediumNeg = style([ui11Medium, { letterSpacing: vars.letterSpacing.ui11Neg }]);
export const ui11BoldNeg = style([ui11Bold, { letterSpacing: vars.letterSpacing.ui11Neg }]);
export const ui12Neg = style([ui12, { letterSpacing: vars.letterSpacing.ui12Neg }]);
export const ui12MediumNeg = style([ui12Medium, { letterSpacing: vars.letterSpacing.ui12Neg }]);
export const ui12BoldNeg = style([ui12Bold, { letterSpacing: vars.letterSpacing.ui12Neg }]);
export const ui13Neg = style([ui13, { letterSpacing: vars.letterSpacing.ui13Neg }]);
export const ui13MediumNeg = style([ui13Medium, { letterSpacing: vars.letterSpacing.ui13Neg }]);
export const ui13BoldNeg = style([ui13Bold, { letterSpacing: vars.letterSpacing.ui13Neg }]);
export const ui14Neg = style([ui14, { letterSpacing: vars.letterSpacing.ui14Neg }]);
export const ui14MediumNeg = style([ui14Medium, { letterSpacing: vars.letterSpacing.ui14Neg }]);
export const ui14BoldNeg = style([ui14Bold, { letterSpacing: vars.letterSpacing.ui14Neg }]);

export const ellipsis = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const label = style([ui11, ellipsis, { color: vars.color.textTertiary }]);
export const sectionTitle = style([ui11Bold, { color: vars.color.text }]);
