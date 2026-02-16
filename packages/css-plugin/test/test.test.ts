import { describe, expect, it } from 'vitest';
import {
  createTokenProcessor,
  mathExpressionsExtension,
  compositionExtension,
} from '@design-sync/w3c-dtfm';
import type { PluginContext, DesignSyncConfig, PluginLogger } from '@design-sync/manager';
import { cssPlugin } from '../src';

function createMockLogger(): PluginLogger {
  return {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    success: () => {},
  };
}

function createMockConfig(): DesignSyncConfig {
  return {
    uri: 'test://tokens',
    out: './out',
    plugins: [],
  };
}

async function buildCssPlugin(
  tokens: Record<string, unknown>,
  pluginConfig: Parameters<typeof cssPlugin>[0] = {},
) {
  const processor = createTokenProcessor(tokens, {
    extensions: [mathExpressionsExtension(), compositionExtension()],
  });
  await processor.process();

  const plugin = cssPlugin(pluginConfig);

  const context: PluginContext = {
    processor,
    query: () => processor.query(),
    tokens: () => processor.tokens(),
    getToken: (path) => processor.get(path),
    modes: processor.modes,
    logger: createMockLogger(),
    config: createMockConfig(),
  };

  return plugin.build(context);
}

function getThemeFile(files: { path: string; content: string }[]) {
  return files.find((f) => f.path.includes('default.css'));
}

function getStylesFile(files: { path: string; content: string }[]) {
  return files.find((f) => f.path.includes('styles.css'));
}

describe('CSS Plugin - Math Expressions', () => {
  it('should output calc() for math expressions with token refs', async () => {
    const result = await buildCssPlugin({
      spacing: {
        $type: 'dimension',
        base: { $value: '8px' },
        double: { $value: '{spacing.base} * 2' },
      },
    });

    const themeFile = getThemeFile(result.files);
    expect(themeFile).toBeDefined();
    expect(themeFile!.content).toContain('calc(var(--spacing-base) * 2)');
  });

  it('should output static value for pure math (no refs)', async () => {
    const result = await buildCssPlugin({
      spacing: {
        $type: 'dimension',
        small: { $value: '4px + 4px' },
      },
    });

    const themeFile = getThemeFile(result.files);
    expect(themeFile).toBeDefined();
    expect(themeFile!.content).toContain('8px');
    expect(themeFile!.content).not.toContain('calc(');
  });

  it('should handle calc() with prefix', async () => {
    const result = await buildCssPlugin(
      {
        spacing: {
          $type: 'dimension',
          base: { $value: '8px' },
          double: { $value: '{spacing.base} * 2' },
        },
      },
      { prefix: 'ds-' },
    );

    const themeFile = getThemeFile(result.files);
    expect(themeFile).toBeDefined();
    expect(themeFile!.content).toContain('calc(var(--ds-spacing-base) * 2)');
  });
});

describe('CSS Plugin - Composition Tokens', () => {
  it('should generate CSS class for composition token', async () => {
    const result = await buildCssPlugin({
      colors: {
        $type: 'color',
        surface: { $value: '#ffffff' },
      },
      radii: {
        $type: 'dimension',
        md: { $value: '8px' },
      },
      card: {
        $type: 'composition',
        $value: {
          fill: '{colors.surface}',
          borderRadius: '{radii.md}',
        },
      },
    });

    const stylesFile = getStylesFile(result.files);
    expect(stylesFile).toBeDefined();

    expect(stylesFile!.content).toContain('.card');
    expect(stylesFile!.content).toContain('background');
    expect(stylesFile!.content).toContain('var(--colors-surface)');
    expect(stylesFile!.content).toContain('border-radius');
    expect(stylesFile!.content).toContain('var(--radii-md)');
  });

  it('should not generate variables for composition tokens', async () => {
    const result = await buildCssPlugin({
      card: {
        $type: 'composition',
        $value: {
          fill: '{colors.surface}',
        },
      },
      colors: {
        $type: 'color',
        surface: { $value: '#ffffff' },
      },
    });

    const themeFile = getThemeFile(result.files);
    if (themeFile) {
      expect(themeFile.content).not.toContain('--card');
    }
  });

  it('should handle composition with prefix', async () => {
    const result = await buildCssPlugin(
      {
        colors: {
          $type: 'color',
          primary: { $value: '#ff0000' },
        },
        button: {
          $type: 'composition',
          $value: {
            backgroundColor: '{colors.primary}',
          },
        },
      },
      { prefix: 'ds-' },
    );

    const stylesFile = getStylesFile(result.files);
    expect(stylesFile).toBeDefined();
    expect(stylesFile!.content).toContain('var(--ds-colors-primary)');
  });
});

describe('CSS Plugin - Combined Math + Composition', () => {
  it('should handle math expressions and composition tokens together', async () => {
    const result = await buildCssPlugin({
      spacing: {
        $type: 'dimension',
        base: { $value: '8px' },
        double: { $value: '{spacing.base} * 2' },
      },
      colors: {
        $type: 'color',
        surface: { $value: '#ffffff' },
      },
      card: {
        $type: 'composition',
        $value: {
          fill: '{colors.surface}',
          padding: '{spacing.double}',
        },
      },
    });

    // Math expression should use calc()
    const themeFile = getThemeFile(result.files);
    expect(themeFile).toBeDefined();
    expect(themeFile!.content).toContain('calc(var(--spacing-base) * 2)');

    // Composition should generate class
    const stylesFile = getStylesFile(result.files);
    expect(stylesFile).toBeDefined();
    expect(stylesFile!.content).toContain('.card');
    expect(stylesFile!.content).toContain('var(--colors-surface)');
    expect(stylesFile!.content).toContain('var(--spacing-double)');
  });
});
