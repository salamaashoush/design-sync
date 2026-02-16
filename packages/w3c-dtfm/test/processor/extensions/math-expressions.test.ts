import { describe, expect, it } from 'vitest';
import { createTokenProcessor } from '../../../src/processor';
import { mathExpressionsExtension } from '../../../src/processor/extensions/builtin/math-expressions';
import type { MathExpressionMetadata } from '../../../src/processor/extensions/builtin/math-expressions';

describe('mathExpressionsExtension', () => {
  describe('basic arithmetic', () => {
    it('should evaluate addition', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '8px + 4px' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.result');
      expect(token).toBeDefined();
      expect(token?.toCSS()).toBe('12px');
    });

    it('should evaluate subtraction', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '16px - 4px' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.result');
      expect(token?.toCSS()).toBe('12px');
    });

    it('should evaluate multiplication', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '4px * 3' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.result');
      expect(token?.toCSS()).toBe('12px');
    });

    it('should evaluate division', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '24px / 2' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.result');
      expect(token?.toCSS()).toBe('12px');
    });
  });

  describe('operator precedence', () => {
    it('should respect multiplication over addition', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '2px + 3 * 4' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.result');
      expect(token?.toCSS()).toBe('14px');
    });

    it('should handle parenthesized expressions', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '(2 + 3) * 4px' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.result');
      expect(token?.toCSS()).toBe('20px');
    });
  });

  describe('unit handling', () => {
    it('should preserve units', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '8rem + 4rem' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.result');
      expect(token?.toCSS()).toBe('12rem');
    });

    it('should warn on mixed units in addition', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '8px + 4rem' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      const result = await processor.process();

      // Mixed units can't be resolved — parser returns undefined, warning logged
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should produce unitless result for number type', async () => {
      const processor = createTokenProcessor(
        {
          scale: {
            $type: 'number',
            result: { $value: '2 + 3' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('scale.result');
      expect(token?.value).toBe(5);
    });
  });

  describe('token references', () => {
    it('should resolve token references and store metadata', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            base: { $value: '8px' },
            double: { $value: '{spacing.base} * 2' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.double');
      expect(token).toBeDefined();
      // Static fallback value is computed
      expect(token?.toCSS()).toBe('16px');

      // Extension metadata is stored for CSS calc() output
      expect(token?.hasExtension('design-sync.math')).toBe(true);
      const meta = token?.getExtension<MathExpressionMetadata>('design-sync.math');
      expect(meta?.expression).toBe('{spacing.base} * 2');
      expect(meta?.hasRefs).toBe(true);
    });

    it('should NOT store metadata for pure math (no refs)', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '8px + 4px' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.result');
      expect(token?.hasExtension('design-sync.math')).toBe(false);
    });
  });

  describe('non-math values', () => {
    it('should not modify plain dimension values', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            base: { $value: '8px' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.base');
      expect(token?.toCSS()).toBe('8px');
    });

    it('should not modify alias-only values', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            base: { $value: '8px' },
            alias: { $value: '{spacing.base}' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('spacing.alias');
      expect(token?.toCSS()).toBe('8px');
    });
  });

  describe('edge cases', () => {
    it('should handle division by zero gracefully', async () => {
      const processor = createTokenProcessor(
        {
          spacing: {
            $type: 'dimension',
            result: { $value: '8px / 0' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      const result = await processor.process();

      // Division by zero returns undefined from parser, warning logged
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should handle negative numbers', async () => {
      const processor = createTokenProcessor(
        {
          scale: {
            $type: 'number',
            result: { $value: '-5 + 3' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('scale.result');
      expect(token?.value).toBe(-2);
    });

    it('should handle decimal numbers', async () => {
      const processor = createTokenProcessor(
        {
          scale: {
            $type: 'number',
            result: { $value: '1.5 * 2' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      const token = processor.get('scale.result');
      expect(token?.value).toBe(3);
    });
  });

  describe('type filtering', () => {
    it('should only process dimension and number types by default', async () => {
      const processor = createTokenProcessor(
        {
          colors: {
            $type: 'color',
            red: { $value: '#ff0000' },
          },
          spacing: {
            $type: 'dimension',
            result: { $value: '8px + 4px' },
          },
        },
        { extensions: [mathExpressionsExtension()] },
      );
      await processor.process();

      // Color should be untouched
      const color = processor.get('colors.red');
      expect(color?.value).toBeDefined();

      // Dimension should be evaluated
      const spacing = processor.get('spacing.result');
      expect(spacing?.toCSS()).toBe('12px');
    });

    it('should allow custom type filtering', async () => {
      const processor = createTokenProcessor(
        {
          duration: {
            $type: 'duration',
            result: { $value: '200ms + 100ms' },
          },
        },
        { extensions: [mathExpressionsExtension({ types: ['duration'] })] },
      );
      await processor.process();

      const token = processor.get('duration.result');
      expect(token?.toCSS()).toBe('300ms');
    });
  });
});
