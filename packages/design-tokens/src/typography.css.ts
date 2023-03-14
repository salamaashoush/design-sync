import { style } from '@vanilla-extract/css';
import { theme } from './theme.css';

// Positive
export const ui11 = style({
  fontFamily: theme.fontFamily.main,
  fontSize: theme.fontSize.ui11,
  fontWeight: theme.fontWeight.regular,
  lineHeight: theme.lineHeight.sm,
  letterSpacing: theme.letterSpacing.ui11,
});
export const ui11Medium = style([ui11, { fontWeight: theme.fontWeight.medium }]);
export const ui11Bold = style([ui11, { fontWeight: theme.fontWeight.bold }]);

export const ui12 = style({
  fontFamily: theme.fontFamily.main,
  fontSize: theme.fontSize.ui12,
  fontWeight: theme.fontWeight.regular,
  lineHeight: theme.lineHeight.sm,
  letterSpacing: theme.letterSpacing.ui12,
});
export const ui12Medium = style([ui12, { fontWeight: theme.fontWeight.medium }]);
export const ui12Bold = style([ui12, { fontWeight: theme.fontWeight.bold }]);

export const ui13 = style({
  fontFamily: theme.fontFamily.main,
  fontSize: theme.fontSize.ui13,
  fontWeight: theme.fontWeight.regular,
  lineHeight: theme.lineHeight.lg,
  letterSpacing: theme.letterSpacing.ui13,
});
export const ui13Medium = style([ui13, { fontWeight: theme.fontWeight.medium }]);
export const ui13Bold = style([ui13, { fontWeight: theme.fontWeight.bold }]);

export const ui14 = style({
  fontFamily: theme.fontFamily.main,
  fontSize: theme.fontSize.ui14,
  fontWeight: theme.fontWeight.regular,
  lineHeight: theme.lineHeight.lg,
  letterSpacing: theme.letterSpacing.ui14,
});

export const ui14Medium = style([ui14, { fontWeight: theme.fontWeight.medium }]);
export const ui14Bold = style([ui14, { fontWeight: theme.fontWeight.bold }]);

// Negative
export const ui11Neg = style([ui11, { letterSpacing: theme.letterSpacing.ui11Neg }]);
export const ui11MediumNeg = style([ui11Medium, { letterSpacing: theme.letterSpacing.ui11Neg }]);
export const ui11BoldNeg = style([ui11Bold, { letterSpacing: theme.letterSpacing.ui11Neg }]);
export const ui12Neg = style([ui12, { letterSpacing: theme.letterSpacing.ui12Neg }]);
export const ui12MediumNeg = style([ui12Medium, { letterSpacing: theme.letterSpacing.ui12Neg }]);
export const ui12BoldNeg = style([ui12Bold, { letterSpacing: theme.letterSpacing.ui12Neg }]);
export const ui13Neg = style([ui13, { letterSpacing: theme.letterSpacing.ui13Neg }]);
export const ui13MediumNeg = style([ui13Medium, { letterSpacing: theme.letterSpacing.ui13Neg }]);
export const ui13BoldNeg = style([ui13Bold, { letterSpacing: theme.letterSpacing.ui13Neg }]);
export const ui14Neg = style([ui14, { letterSpacing: theme.letterSpacing.ui14Neg }]);
export const ui14MediumNeg = style([ui14Medium, { letterSpacing: theme.letterSpacing.ui14Neg }]);
export const ui14BoldNeg = style([ui14Bold, { letterSpacing: theme.letterSpacing.ui14Neg }]);

export const ellipsis = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const label = style([ui11, ellipsis, { color: theme.color.textTertiary }]);
export const sectionTitle = style([ui11Bold, { color: theme.color.text }]);
