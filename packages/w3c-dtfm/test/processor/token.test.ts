import { describe, expect, it, beforeAll } from 'vitest';
import { createTokenProcessor, type ProcessedToken, type TokenProcessorInterface } from '../../src/processor';

describe('ProcessedToken', () => {
  let processor: TokenProcessorInterface;
  let colorToken: ProcessedToken<'color'> | undefined;
  let typographyToken: ProcessedToken<'typography'> | undefined;
  let deprecatedToken: ProcessedToken | undefined;

  const sampleTokens = {
    color: {
      $type: 'color',
      primary: {
        $value: '#ff0000',
        $description: 'Primary brand color',
        $extensions: {
          figma: {
            nodeId: '123',
          },
        },
      },
      deprecated: {
        $value: '#999999',
        $deprecated: 'Use primary instead',
      },
    },
    spacing: {
      $type: 'dimension',
      md: {
        $value: '16px',
      },
    },
    typography: {
      heading: {
        $type: 'typography',
        $value: {
          fontFamily: ['Inter', 'sans-serif'],
          fontSize: '24px',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '0px',
        },
      },
    },
  };

  beforeAll(async () => {
    processor = createTokenProcessor(sampleTokens, {
      disableBuiltinExtensions: true,
    });
    await processor.process();

    colorToken = processor.get('color.primary') as ProcessedToken<'color'> | undefined;
    typographyToken = processor.get('typography.heading') as ProcessedToken<'typography'> | undefined;
    deprecatedToken = processor.get('color.deprecated');
  });

  describe('basic properties', () => {
    it('should have correct path', () => {
      expect(colorToken?.path).toBe('color.primary');
    });

    it('should have correct name', () => {
      expect(colorToken?.name).toBe('primary');
    });

    it('should have correct group', () => {
      expect(colorToken?.group).toBe('color');
    });

    it('should have correct type', () => {
      expect(colorToken?.type).toBe('color');
    });
  });

  describe('value access', () => {
    it('should provide rawValue', () => {
      // After W3C migration, hex colors are converted to color objects
      expect(colorToken?.rawValue).toBeDefined();
    });

    it('should provide normalized value', () => {
      expect(colorToken?.value).toBeDefined();
    });

    it('should provide modeValues', () => {
      expect(colorToken?.modeValues).toBeDefined();
      expect(colorToken?.modeValues['default']).toBeDefined();
    });

    it('should provide getValue() for specific mode', () => {
      const value = colorToken?.getValue('default');
      expect(value).toBeDefined();
    });

    it('should fall back to default mode when mode not found', () => {
      const defaultValue = colorToken?.getValue();
      const unknownModeValue = colorToken?.getValue('unknown');
      expect(unknownModeValue).toEqual(defaultValue);
    });
  });

  describe('metadata', () => {
    it('should have description', () => {
      expect(colorToken?.description).toBe('Primary brand color');
    });

    it('should indicate deprecation', () => {
      expect(colorToken?.isDeprecated).toBe(false);
      expect(deprecatedToken?.isDeprecated).toBe(true);
    });

    it('should provide deprecation message', () => {
      expect(deprecatedToken?.deprecationMessage).toBe('Use primary instead');
    });

    it('should provide isGenerated flag', () => {
      expect(colorToken?.isGenerated).toBe(false);
    });

    it('should provide raw token', () => {
      expect(colorToken?.raw).toBeDefined();
      expect(colorToken?.raw.$type).toBe('color');
    });
  });

  describe('extensions', () => {
    it('should have extensions', () => {
      expect(colorToken?.extensions).toBeDefined();
    });

    it('should check for extension presence', () => {
      expect(colorToken?.hasExtension('figma')).toBe(true);
      expect(colorToken?.hasExtension('nonexistent')).toBe(false);
    });

    it('should get extension value', () => {
      const figma = colorToken?.getExtension<{ nodeId: string }>('figma');
      expect(figma?.nodeId).toBe('123');
    });

    it('should return undefined for missing extension', () => {
      expect(colorToken?.getExtension('nonexistent')).toBeUndefined();
    });
  });

  describe('mode information', () => {
    it('should provide defaultMode', () => {
      expect(colorToken?.defaultMode).toBe('default');
    });

    it('should provide requiredModes', () => {
      expect(colorToken?.requiredModes).toContain('default');
    });

    it('should indicate multi-mode status', () => {
      expect(colorToken?.isMultiMode).toBe(false); // Only default mode
    });
  });

  describe('CSS utilities', () => {
    it('should generate CSS variable reference', () => {
      const cssVar = colorToken?.toCSSVar();
      expect(cssVar).toBe('var(--color-primary)');
    });

    it('should generate CSS variable with prefix', () => {
      const cssVar = colorToken?.toCSSVar('ds-');
      expect(cssVar).toBe('var(--ds-color-primary)');
    });

    it('should generate CSS value', () => {
      const css = colorToken?.toCSS();
      expect(css).toBeDefined();
      expect(typeof css).toBe('string');
    });
  });

  describe('typography token', () => {
    it('should have typography type', () => {
      expect(typographyToken?.type).toBe('typography');
    });

    it('should have normalized typography value', () => {
      const value = typographyToken?.value;
      expect(value).toBeDefined();
    });
  });
});
