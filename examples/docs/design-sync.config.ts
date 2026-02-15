import { defineConfig } from '@design-sync/cli';
import { docsPlugin } from '@design-sync/docs-plugin';

export default defineConfig({
  uri: 'github:kadena-community/design-system/tokens#main',
  out: 'docs',
  defaultMode: 'light',
  requiredModes: ['light', 'dark'],
  prettify: false,
  plugins: [
    docsPlugin({
      projectName: 'Kadena Design System',
      markdown: {
        splitByType: true,
        includeToc: true,
        includePreviews: true,
      },
      html: {
        title: 'Design Tokens Documentation',
        enableSearch: true,
        enableModeSwitch: true,
        enableCopy: true,
        showExamples: true,
        primaryColor: '#3b82f6',
        // Enhanced UI features
        showContrastRatios: true,
        showColorBlindness: true,
        showHierarchyView: true,
        showComparisonMode: true,
        showColorPalettes: true,
        showSpacingRuler: true,
        enhancedTypography: true,
      },
      json: true,
      includeDeprecated: true,
      includeGenerated: true,
    }),
  ],
});
