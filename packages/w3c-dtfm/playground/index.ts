import { TokensWalker } from '../src';

const walker = new TokensWalker({
  $extensions: {
    modes: {
      requiredModes: ['light', 'dark'],
      defaultMode: 'light',
    },
  },
  kda: {
    colors: {
      $type: 'color',
      primary: {
        value: '#fff',
        $extensions: {
          mode: {
            dark: '#000',
          },
        },
      },
    },
  },
});

walker.walkTokens(() => {
  console.log('walkTokens');
});
