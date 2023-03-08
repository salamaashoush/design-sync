import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss';

import { resolve } from 'path';
const __dirname = new URL('.', import.meta.url).host;
const iconsPath = resolve(__dirname, '../../packages/icons/svgs');
console.log(__dirname, iconsPath);
export default defineConfig({
  presets: [
    presetIcons({
      customizations: {},
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then((x) => x.default),
        figma: async (name) => {
          console.log(name);
          const s = await FileSystemIconLoader(iconsPath)(name);
          console.log(s);
          return s;
        },
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
