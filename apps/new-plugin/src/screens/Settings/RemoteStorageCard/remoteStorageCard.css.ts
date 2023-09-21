import { theme } from '@tokenize/design-tokens';
import { recipe } from '@vanilla-extract/recipes';

export const remoteStorageCard = recipe({
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.extraSmall,
    gap: theme.spacing.extraSmall,
    border: `1px solid ${theme.color.border}`,
  },

  variants: {
    selected: {
      true: {
        border: `1px solid ${theme.color.borderOnBrandStrong}`,
        background: theme.color.bgBrandPressed,
      },
    },
  },
});
