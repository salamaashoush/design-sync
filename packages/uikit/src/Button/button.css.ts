import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../theme.css';
import { ui11Medium } from '../Typography/typography.css';

export const button = recipe({
  base: [
    ui11Medium,
    {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      borderRadius: vars.borderRadius.large,
      color: vars.color.text,
      height: vars.sizing.md,
      paddingInline: vars.spacing.xs,
      textDecoration: 'none',
      outline: 'none',
      border: '2px solid transparent',
      userSelect: 'none',
      selectors: {
        '&:disabled': {
          cursor: 'not-allowed',
          color: vars.color.textDisabled,
        },
      },
    },
  ],
  variants: {
    intent: {
      primary: {
        background: vars.color.bgBrand,
        color: vars.color.textOnbrand,
        selectors: {
          '&:enabled:active, &:enabled:focus': {
            border: `2px solid ${vars.color.borderOnbrand}`,
          },
          '&:disabled': {
            backgroundColor: vars.color.bgDisabled,
          },
        },
      },

      secondary: {
        background: vars.color.transparent,
        border: `1px solid ${vars.color.borderStrong}`,
        paddingInline: `calc(${vars.spacing.xs} + 1px)`,
        selectors: {
          '&:enabled:active, &:enabled:focus': {
            border: `2px solid ${vars.color.borderBrandStrong}`,
            paddingInline: vars.spacing.xs,
          },
          '&:disabled': {
            borderColor: vars.color.borderDisabled,
          },
        },
      },
    },
    destructive: {
      true: {},
    },
  },

  compoundVariants: [
    {
      variants: {
        intent: 'primary',
        destructive: true,
      },
      style: {
        backgroundColor: vars.color.bgDanger,
        ':disabled': {
          backgroundColor: vars.color.bgDanger,
          color: vars.color.textOndanger,
          opacity: 0.4,
        },
        selectors: {
          '&:enabled:active, &:enabled:focus': {
            border: `2px solid ${vars.color.borderOndanger}`,
          },
        },
      },
    },
    {
      variants: {
        intent: 'secondary',
        destructive: true,
      },
      style: {
        borderColor: vars.color.borderDangerStrong,
        color: vars.color.textDangerSecondary,
        selectors: {
          '&:enabled:active, &:enabled:focus': {
            border: `2px solid ${vars.color.borderDangerStrong}`,
          },
          '&:disabled': {
            borderColor: vars.color.borderDangerStrong,
            color: vars.color.textDangerSecondary,
            opacity: 0.4,
          },
        },
      },
    },
  ],

  defaultVariants: {
    intent: 'primary',
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
