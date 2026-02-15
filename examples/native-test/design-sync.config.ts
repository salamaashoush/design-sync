import { defineConfig } from '@design-sync/cli';
import { assetsPlugin } from '@design-sync/assets-plugin';
import { composePlugin } from '@design-sync/compose-plugin';
import { docsPlugin } from '@design-sync/docs-plugin';
import { flutterPlugin } from '@design-sync/flutter-plugin';
import { swiftUIPlugin } from '@design-sync/swiftui-plugin';
import { reactNativePlugin } from '@design-sync/react-native-plugin';

export default defineConfig({
  uri: 'github:kadena-community/design-system/tokens#main',
  out: 'generated',
  defaultMode: 'light',
  requiredModes: ['light', 'dark'],
  prettify: false,
  plugins: [
    // Assets Plugin - SVG sprites, React components from icon tokens
    assetsPlugin({
      outDir: 'assets',
      sprite: {
        filename: 'icons.svg',
        ariaHidden: true,
      },
      components: {
        framework: 'react',
        outDir: 'react-icons',
        suffix: 'Icon',
        generateIndex: true,
      },
      css: {
        filename: 'icons.css',
        utilityClasses: true,
        prefix: 'icon',
      },
      typescript: {
        enumStyle: 'union',
        exportName: 'IconName',
      },
      manifest: true,
    }),

    // Documentation Plugin - with icon previews
    docsPlugin({
      outDir: 'docs',
      projectName: 'Kadena Design System',
      markdown: {
        splitByType: true,
        includeToc: true,
      },
      html: {
        title: 'Design Tokens Documentation',
        enableSearch: true,
        enableModeSwitch: true,
        showContrastRatios: true,
        showColorPalettes: true,
      },
    }),

    // Compose/Kotlin - Material 3 with Dynamic Colors
    composePlugin({
      outDir: 'compose',
      packageName: 'com.example.theme',
      stripPrefix: ['kda', 'foundation'],
      dynamicColors: true,
    }),

    // Flutter/Dart - Material 3 with ThemeExtension
    flutterPlugin({
      outDir: 'flutter',
      libraryName: 'app_theme',
      stripPrefix: ['kda', 'foundation'],
      generateThemeExtension: true,
    }),

    // SwiftUI - Semantic colors and Dynamic Type
    swiftUIPlugin({
      outDir: 'swiftui',
      packageName: 'DesignTokens',
      stripPrefix: ['kda', 'foundation'],
      supportDynamicType: true,
      generateEnvironmentValues: true,
    }),

    // React Native - Responsive scaling and Paper theme
    reactNativePlugin({
      outDir: 'react-native',
      stripPrefix: ['kda', 'foundation'],
      responsiveScaling: true,
      generatePaperTheme: true,
      generateProvider: true,
    }),
  ],
});
