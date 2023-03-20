import { theme } from '@tokenize/design-tokens';
import { ui11Medium } from '@tokenize/design-tokens/src/typography.css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

export const button = recipe({
  base: [
    ui11Medium,
    {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      borderRadius: theme.borderRadius.lg,
      color: theme.color.text,
      height: theme.sizing.md,
      paddingInline: theme.spacing.xs,
      textDecoration: 'none',
      outline: 'none',
      border: '2px solid transparent',
      userSelect: 'none',
      selectors: {
        '&:disabled': {
          cursor: 'not-allowed',
          color: theme.color.textDisabled,
        },
      },
    },
  ],
  variants: {
    intent: {
      primary: {
        background: theme.color.bgBrand,
        color: theme.color.textOnbrand,
        selectors: {
          '&:enabled:active, &:enabled:focus': {
            border: `2px solid ${theme.color.borderOnbrand}`,
          },
          '&:disabled': {
            backgroundColor: theme.color.bgDisabled,
          },
        },
      },

      secondary: {
        background: theme.color.transparent,
        border: `1px solid ${theme.color.borderStrong}`,
        paddingInline: `calc(${theme.spacing.xs} + 1px)`,
        selectors: {
          '&:enabled:active, &:enabled:focus': {
            border: `2px solid ${theme.color.borderBrandStrong}`,
            paddingInline: theme.spacing.xs,
          },
          '&:disabled': {
            borderColor: theme.color.borderDisabled,
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
        backgroundColor: theme.color.bgDanger,
        ':disabled': {
          backgroundColor: theme.color.bgDanger,
          color: theme.color.textOndanger,
          opacity: 0.4,
        },
        selectors: {
          '&:enabled:active, &:enabled:focus': {
            border: `2px solid ${theme.color.borderOndanger}`,
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
        borderColor: theme.color.borderDangerStrong,
        color: theme.color.textDangerSecondary,
        selectors: {
          '&:enabled:active, &:enabled:focus': {
            border: `2px solid ${theme.color.borderDangerStrong}`,
          },
          '&:disabled': {
            borderColor: theme.color.borderDangerStrong,
            color: theme.color.textDangerSecondary,
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
