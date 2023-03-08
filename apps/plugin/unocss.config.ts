import { theme } from '@tokenize/uikit/theme-config';
import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss';
export default defineConfig({
  theme: theme,
  presets: [
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then((x) => x.default),
      },
      extraProperties: {
        display: 'inline-block',
        height: '1.2em',
        width: '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetUno({
      preflight: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,800',
      },
    }),
  ],
});
