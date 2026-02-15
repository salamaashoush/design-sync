import { describe, expect, it } from 'vitest';
import { createTokenProcessor } from '../../src/processor';

describe('createTokenProcessor', () => {
  const sampleTokens = {
    color: {
      $type: 'color',
      primary: {
        $value: '#ff0000',
      },
      secondary: {
        $value: '#00ff00',
      },
      deprecated: {
        $value: '#0000ff',
        $deprecated: 'Use primary instead',
      },
    },
    spacing: {
      $type: 'dimension',
      sm: {
        $value: '8px',
      },
      md: {
        $value: '16px',
      },
      lg: {
        $value: '24px',
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

  describe('initialization', () => {
    it('should create a processor instance', () => {
      const processor = createTokenProcessor(sampleTokens);
      expect(processor).toBeDefined();
      expect(processor.size).toBe(0); // Not processed yet
    });

    it('should accept options', () => {
      const processor = createTokenProcessor(sampleTokens, {
        defaultMode: 'light',
        requiredModes: ['light', 'dark'],
      });
      expect(processor).toBeDefined();
    });
  });

  describe('process()', () => {
    it('should process tokens and populate the map', async () => {
      const processor = createTokenProcessor(sampleTokens);
      const result = await processor.process();

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
      expect(processor.size).toBe(result.tokenCount);
    });

    it('should extract all tokens from nested structure', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      expect(processor.has('color.primary')).toBe(true);
      expect(processor.has('color.secondary')).toBe(true);
      expect(processor.has('spacing.sm')).toBe(true);
      expect(processor.has('typography.heading')).toBe(true);
    });

    it('should handle empty tokens', async () => {
      const processor = createTokenProcessor({});
      const result = await processor.process();

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(0);
    });
  });

  describe('get()', () => {
    it('should return token by path', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      const token = processor.get('color.primary');
      expect(token).toBeDefined();
      expect(token?.path).toBe('color.primary');
      expect(token?.type).toBe('color');
    });

    it('should return undefined for non-existent path', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      const token = processor.get('non.existent.path');
      expect(token).toBeUndefined();
    });
  });

  describe('has()', () => {
    it('should return true for existing token', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      expect(processor.has('color.primary')).toBe(true);
    });

    it('should return false for non-existent token', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      expect(processor.has('non.existent')).toBe(false);
    });
  });

  describe('tokens()', () => {
    it('should iterate over all tokens', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      const paths: string[] = [];
      for (const token of processor.tokens()) {
        paths.push(token.path);
      }

      expect(paths).toContain('color.primary');
      expect(paths).toContain('spacing.md');
    });
  });

  describe('modes', () => {
    it('should provide default mode information', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      expect(processor.modes.defaultMode).toBe('default');
    });

    it('should use configured modes', async () => {
      const processor = createTokenProcessor(sampleTokens, {
        defaultMode: 'light',
        requiredModes: ['light', 'dark'],
      });
      await processor.process();

      expect(processor.modes.defaultMode).toBe('light');
      expect(processor.modes.requiredModes).toContain('light');
      expect(processor.modes.requiredModes).toContain('dark');
    });
  });

  describe('meta', () => {
    it('should provide metadata after processing', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      expect(processor.meta.tokenCount).toBeGreaterThan(0);
      expect(processor.meta.processedAt).toBeInstanceOf(Date);
      expect(processor.meta.detectedFormat).toBeDefined();
    });
  });

  describe('clone()', () => {
    it('should create a new processor with same tokens', async () => {
      const processor = createTokenProcessor(sampleTokens);
      const cloned = processor.clone();

      expect(cloned).not.toBe(processor);
      await cloned.process();
      expect(cloned.size).toBeGreaterThan(0);
    });

    it('should accept new options', async () => {
      const processor = createTokenProcessor(sampleTokens, {
        defaultMode: 'light',
      });
      const cloned = processor.clone({
        defaultMode: 'dark',
      });

      await cloned.process();
      expect(cloned.modes.defaultMode).toBe('dark');
    });
  });

  describe('setTokens()', () => {
    it('should replace tokens and reset state', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      const initialSize = processor.size;

      processor.setTokens({
        color: {
          $type: 'color',
          only: {
            $value: '#ffffff',
          },
        },
      });

      expect(processor.size).toBe(0); // Reset

      await processor.process();
      expect(processor.size).toBe(1);
      expect(processor.size).not.toBe(initialSize);
    });
  });

  describe('reprocess()', () => {
    it('should clear and reprocess tokens', async () => {
      const processor = createTokenProcessor(sampleTokens);
      await processor.process();

      const initialSize = processor.size;

      const result = await processor.reprocess();
      expect(result.success).toBe(true);
      expect(processor.size).toBe(initialSize);
    });
  });
});
