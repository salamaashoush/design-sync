import { defineConfig } from '@pandacss/dev';
import { designTokensPreset } from './src/tokens/preset';

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  presets: [designTokensPreset],
  outdir: 'styled-system',
  jsxFramework: 'react',
  theme: {
    extend: {},
  },
});
