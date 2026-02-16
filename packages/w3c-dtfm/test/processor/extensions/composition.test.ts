import { describe, expect, it } from 'vitest';
import { createTokenProcessor } from '../../../src/processor';
import { compositionExtension } from '../../../src/processor/extensions/builtin/composition';
import type { CompositionMetadata } from '../../../src/processor/extensions/builtin/composition';

describe('compositionExtension', () => {
  describe('metadata storage', () => {
    it('should store composition metadata with correct CSS property mappings', async () => {
      const processor = createTokenProcessor(
        {
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
        },
        { extensions: [compositionExtension()] },
      );
      await processor.process();

      const token = processor.get('card');
      expect(token).toBeDefined();
      expect(token?.hasExtension('design-sync.composition')).toBe(true);

      const meta = token?.getExtension<CompositionMetadata>('design-sync.composition');
      expect(meta?.properties.fill).toEqual({
        value: '{colors.surface}',
        cssProperty: 'background',
        inferredType: 'color',
      });
      expect(meta?.properties.borderRadius).toEqual({
        value: '{radii.md}',
        cssProperty: 'border-radius',
        inferredType: 'dimension',
      });
    });

    it('should use kebab-case for unknown properties', async () => {
      const processor = createTokenProcessor(
        {
          card: {
            $type: 'composition',
            $value: {
              customSpacing: '16px',
            },
          },
        },
        { extensions: [compositionExtension()] },
      );
      await processor.process();

      const token = processor.get('card');
      const meta = token?.getExtension<CompositionMetadata>('design-sync.composition');
      expect(meta?.properties.customSpacing.cssProperty).toBe('custom-spacing');
    });
  });

  describe('non-composition tokens', () => {
    it('should not affect non-composition tokens', async () => {
      const processor = createTokenProcessor(
        {
          colors: {
            $type: 'color',
            primary: { $value: '#ff0000' },
          },
        },
        { extensions: [compositionExtension()] },
      );
      await processor.process();

      const token = processor.get('colors.primary');
      expect(token).toBeDefined();
      expect(token?.type).toBe('color');
      expect(token?.hasExtension('design-sync.composition')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle composition with no properties gracefully', async () => {
      const processor = createTokenProcessor(
        {
          empty: {
            $type: 'composition',
            $value: {},
          },
        },
        { extensions: [compositionExtension()] },
      );
      await processor.process();

      const token = processor.get('empty');
      expect(token).toBeDefined();
      const meta = token?.getExtension<CompositionMetadata>('design-sync.composition');
      expect(meta?.properties).toEqual({});
    });

    it('should handle numeric property values', async () => {
      const processor = createTokenProcessor(
        {
          mixed: {
            $type: 'composition',
            $value: {
              valid: '{colors.surface}',
              opacity: 0.5,
            },
          },
          colors: {
            $type: 'color',
            surface: { $value: '#ffffff' },
          },
        },
        { extensions: [compositionExtension()] },
      );
      await processor.process();

      const token = processor.get('mixed');
      const meta = token?.getExtension<CompositionMetadata>('design-sync.composition');
      expect(meta?.properties.valid).toBeDefined();
      // Numbers are converted to string representation
      expect(meta?.properties.opacity.value).toBe('0.5');
    });

    it('should skip unsupported property value types', async () => {
      const processor = createTokenProcessor(
        {
          mixed: {
            $type: 'composition',
            $value: {
              valid: '{colors.surface}',
              invalid: [1, 2, 3],
            },
          },
          colors: {
            $type: 'color',
            surface: { $value: '#ffffff' },
          },
        },
        { extensions: [compositionExtension()] },
      );
      await processor.process();

      const token = processor.get('mixed');
      const meta = token?.getExtension<CompositionMetadata>('design-sync.composition');
      expect(meta?.properties.valid).toBeDefined();
      expect(meta?.properties.invalid).toBeUndefined();
    });

    it('should warn on invalid composition value (non-object)', async () => {
      const processor = createTokenProcessor(
        {
          bad: {
            $type: 'composition',
            $value: 'not-an-object',
          },
        },
        { extensions: [compositionExtension()] },
      );
      await processor.process();

      const token = processor.get('bad');
      expect(token?.hasExtension('design-sync.composition')).toBe(false);
    });
  });
});
