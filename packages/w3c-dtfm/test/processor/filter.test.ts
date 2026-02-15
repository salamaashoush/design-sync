import { describe, expect, it, beforeAll } from 'vitest';
import {
  compileFilter,
  combineFiltersAnd,
  combineFiltersOr,
  negateFilter,
} from '../../src/processor/filter';
import { createTokenProcessor, type ProcessedToken, type TokenProcessorInterface } from '../../src/processor';

describe('Filter Utilities', () => {
  let processor: TokenProcessorInterface;
  let tokens: ProcessedToken[];

  const sampleTokens = {
    color: {
      $type: 'color',
      primary: {
        $value: '#ff0000',
      },
      secondary: {
        $value: '#00ff00',
        $deprecated: true,
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
    },
  };

  beforeAll(async () => {
    processor = createTokenProcessor(sampleTokens, {
      disableBuiltinExtensions: true,
    });
    await processor.process();
    tokens = processor.query().toArray();
  });

  describe('compileFilter', () => {
    it('should compile "*" to match all', () => {
      const filter = compileFilter('*');
      expect(tokens.every(filter)).toBe(true);
    });

    it('should compile undefined to match all', () => {
      const filter = compileFilter(undefined);
      expect(tokens.every(filter)).toBe(true);
    });

    it('should compile single type string', () => {
      const filter = compileFilter('color');
      const matching = tokens.filter(filter);

      expect(matching.every((t) => t.type === 'color')).toBe(true);
    });

    it('should compile type array', () => {
      const filter = compileFilter(['color', 'dimension']);
      const matching = tokens.filter(filter);

      expect(matching.every((t) => t.type === 'color' || t.type === 'dimension')).toBe(true);
    });

    it('should compile path string pattern', () => {
      const filter = compileFilter('primary');
      const matching = tokens.filter(filter);

      expect(matching.length).toBeGreaterThan(0);
      expect(matching.every((t) => t.path.includes('primary'))).toBe(true);
    });

    it('should compile RegExp pattern', () => {
      const filter = compileFilter(/color\./);
      const matching = tokens.filter(filter);

      expect(matching.length).toBe(2);
      expect(matching.every((t) => t.path.startsWith('color.'))).toBe(true);
    });

    it('should compile predicate function', () => {
      const filter = compileFilter((token) => token.name === 'sm');
      const matching = tokens.filter(filter);

      expect(matching.length).toBe(1);
      expect(matching[0].path).toBe('spacing.sm');
    });

    it('should compile filter object with type', () => {
      const filter = compileFilter({ type: 'dimension' });
      const matching = tokens.filter(filter);

      expect(matching.every((t) => t.type === 'dimension')).toBe(true);
    });

    it('should compile filter object with type array', () => {
      const filter = compileFilter({ type: ['color', 'dimension'] });
      expect(tokens.every(filter)).toBe(true);
    });

    it('should compile filter object with path', () => {
      const filter = compileFilter({ path: 'color.primary' });
      const matching = tokens.filter(filter);

      expect(matching.length).toBe(1);
      expect(matching[0].path).toBe('color.primary');
    });

    it('should compile filter object with path array', () => {
      const filter = compileFilter({ path: ['primary', 'sm'] });
      const matching = tokens.filter(filter);

      expect(matching.length).toBe(2);
    });

    it('should compile filter object with deprecated', () => {
      const filter = compileFilter({ deprecated: true });
      const matching = tokens.filter(filter);

      expect(matching.every((t) => t.isDeprecated)).toBe(true);
    });

    it('should compile filter object with generated', () => {
      const filter = compileFilter({ generated: false });
      const matching = tokens.filter(filter);

      expect(matching.every((t) => !t.isGenerated)).toBe(true);
    });

    it('should compile glob-like patterns', () => {
      const filter = compileFilter('color.*');
      const matching = tokens.filter(filter);

      expect(matching.length).toBe(2);
      expect(matching.every((t) => t.path.startsWith('color.'))).toBe(true);
    });
  });

  describe('combineFiltersAnd', () => {
    it('should combine filters with AND logic', () => {
      const filter = combineFiltersAnd(
        { type: 'color' },
        { deprecated: false },
      );
      const matching = tokens.filter(filter);

      expect(matching.length).toBe(1);
      expect(matching[0].path).toBe('color.primary');
    });

    it('should handle empty filters', () => {
      const filter = combineFiltersAnd();
      expect(tokens.every(filter)).toBe(true);
    });

    it('should handle single filter', () => {
      const filter = combineFiltersAnd({ type: 'color' });
      const matching = tokens.filter(filter);

      expect(matching.every((t) => t.type === 'color')).toBe(true);
    });
  });

  describe('combineFiltersOr', () => {
    it('should combine filters with OR logic', () => {
      const filter = combineFiltersOr(
        { path: 'color.primary' },
        { path: 'spacing.sm' },
      );
      const matching = tokens.filter(filter);

      expect(matching.length).toBe(2);
    });

    it('should handle empty filters', () => {
      const filter = combineFiltersOr();
      expect(tokens.every(filter)).toBe(true);
    });
  });

  describe('negateFilter', () => {
    it('should negate a filter', () => {
      const original = compileFilter('color');
      const negated = negateFilter(original);

      const originalMatching = tokens.filter(original);
      const negatedMatching = tokens.filter(negated);

      expect(originalMatching.length + negatedMatching.length).toBe(tokens.length);
    });

    it('should negate filter objects', () => {
      const negated = negateFilter({ type: 'color' });
      const matching = tokens.filter(negated);

      expect(matching.every((t) => t.type !== 'color')).toBe(true);
    });
  });
});
