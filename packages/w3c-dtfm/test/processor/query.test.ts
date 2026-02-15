import { describe, expect, it, beforeAll } from 'vitest';
import { createTokenProcessor, type TokenProcessorInterface } from '../../src/processor';

describe('TokenQueryBuilder', () => {
  let processor: TokenProcessorInterface;

  const sampleTokens = {
    color: {
      $type: 'color',
      brand: {
        primary: {
          $value: '#ff0000',
        },
        secondary: {
          $value: '#00ff00',
          $deprecated: true,
        },
      },
      neutral: {
        gray100: {
          $value: '#f5f5f5',
        },
        gray900: {
          $value: '#1a1a1a',
        },
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
        $deprecated: 'Use typography.display instead',
      },
      body: {
        $type: 'typography',
        $value: {
          fontFamily: ['Inter', 'sans-serif'],
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: 1.5,
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
  });

  describe('ofType()', () => {
    it('should filter by single type', () => {
      const colors = processor.query().ofType('color').toArray();

      expect(colors.length).toBeGreaterThan(0);
      expect(colors.every((t) => t.type === 'color')).toBe(true);
    });

    it('should narrow TypeScript type', () => {
      const colors = processor.query().ofType('color').toArray();

      // TypeScript should know these are color tokens
      for (const color of colors) {
        expect(color.type).toBe('color');
      }
    });
  });

  describe('ofTypes()', () => {
    it('should filter by multiple types', () => {
      const tokens = processor.query().ofTypes('color', 'dimension').toArray();

      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens.every((t) => t.type === 'color' || t.type === 'dimension')).toBe(true);
    });
  });

  describe('matching()', () => {
    it('should match path with string', () => {
      const tokens = processor.query().matching('brand').toArray();

      expect(tokens.length).toBe(2);
      expect(tokens.every((t) => t.path.includes('brand'))).toBe(true);
    });

    it('should match path with regex', () => {
      const tokens = processor.query().matching(/gray\d+/).toArray();

      expect(tokens.length).toBe(2);
      expect(tokens.every((t) => /gray\d+/.test(t.path))).toBe(true);
    });

    it('should support glob-like patterns', () => {
      const tokens = processor.query().matching('color.brand.*').toArray();

      expect(tokens.length).toBe(2);
    });
  });

  describe('inGroup()', () => {
    it('should filter by group path', () => {
      const tokens = processor.query().inGroup('color.brand').toArray();

      expect(tokens.length).toBe(2);
      expect(tokens.every((t) => t.group === 'color.brand')).toBe(true);
    });

    it('should include nested groups', () => {
      const tokens = processor.query().inGroup('color').toArray();

      expect(tokens.length).toBe(4);
      expect(tokens.every((t) => t.group.startsWith('color'))).toBe(true);
    });
  });

  describe('startsWith()', () => {
    it('should filter by path prefix', () => {
      const tokens = processor.query().startsWith('spacing').toArray();

      expect(tokens.length).toBe(3);
      expect(tokens.every((t) => t.path.startsWith('spacing'))).toBe(true);
    });
  });

  describe('where()', () => {
    it('should filter with custom predicate', () => {
      const tokens = processor
        .query()
        .where((t) => t.name.includes('primary'))
        .toArray();

      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens.every((t) => t.name.includes('primary'))).toBe(true);
    });
  });

  describe('deprecated()', () => {
    it('should filter deprecated tokens', () => {
      const tokens = processor.query().deprecated().toArray();

      expect(tokens.length).toBe(2);
      expect(tokens.every((t) => t.isDeprecated)).toBe(true);
    });
  });

  describe('notDeprecated()', () => {
    it('should filter non-deprecated tokens', () => {
      const tokens = processor.query().notDeprecated().toArray();

      expect(tokens.every((t) => !t.isDeprecated)).toBe(true);
    });
  });

  describe('chaining', () => {
    it('should support chaining multiple filters', () => {
      const tokens = processor
        .query()
        .ofType('color')
        .inGroup('color.brand')
        .notDeprecated()
        .toArray();

      expect(tokens.length).toBe(1);
      expect(tokens[0].path).toBe('color.brand.primary');
    });
  });

  describe('sortByPath()', () => {
    it('should sort ascending by default', () => {
      const tokens = processor.query().ofType('dimension').sortByPath().toArray();

      const paths = tokens.map((t) => t.path);
      expect(paths).toEqual([...paths].sort());
    });

    it('should sort descending when specified', () => {
      const tokens = processor.query().ofType('dimension').sortByPath('desc').toArray();

      const paths = tokens.map((t) => t.path);
      expect(paths).toEqual([...paths].sort().reverse());
    });
  });

  describe('take()', () => {
    it('should limit results', () => {
      const tokens = processor.query().take(2).toArray();

      expect(tokens.length).toBe(2);
    });
  });

  describe('skip()', () => {
    it('should skip results', () => {
      const allTokens = processor.query().toArray();
      const skipped = processor.query().skip(2).toArray();

      expect(skipped.length).toBe(allTokens.length - 2);
    });
  });

  describe('skip() and take()', () => {
    it('should work together for pagination', () => {
      const page1 = processor.query().take(3).toArray();
      const page2 = processor.query().skip(3).take(3).toArray();

      expect(page1.length).toBe(3);
      expect(page2.length).toBeLessThanOrEqual(3);
      expect(page1[0].path).not.toBe(page2[0]?.path);
    });
  });

  describe('terminal operations', () => {
    describe('toArray()', () => {
      it('should return an array', () => {
        const tokens = processor.query().toArray();
        expect(Array.isArray(tokens)).toBe(true);
      });
    });

    describe('toMap()', () => {
      it('should return a Map with path keys', () => {
        const map = processor.query().toMap();

        expect(map).toBeInstanceOf(Map);
        expect(map.has('color.brand.primary')).toBe(true);
      });
    });

    describe('groupByType()', () => {
      it('should group tokens by type', () => {
        const groups = processor.query().groupByType();

        expect(groups).toBeInstanceOf(Map);
        expect(groups.has('color')).toBe(true);
        expect(groups.has('dimension')).toBe(true);
        expect(groups.get('color')?.length).toBe(4);
      });
    });

    describe('first()', () => {
      it('should return first matching token', () => {
        const token = processor.query().ofType('color').first();

        expect(token).toBeDefined();
        expect(token?.type).toBe('color');
      });

      it('should return undefined if no matches', () => {
        const token = processor.query().matching('nonexistent').first();

        expect(token).toBeUndefined();
      });
    });

    describe('count()', () => {
      it('should return count of matching tokens', () => {
        const count = processor.query().ofType('color').count();

        expect(count).toBe(4);
      });
    });

    describe('exists()', () => {
      it('should return true if matches exist', () => {
        const exists = processor.query().ofType('color').exists();

        expect(exists).toBe(true);
      });

      it('should return false if no matches', () => {
        const exists = processor.query().matching('nonexistent').exists();

        expect(exists).toBe(false);
      });
    });

    describe('forEach()', () => {
      it('should iterate over matching tokens', () => {
        const paths: string[] = [];
        processor
          .query()
          .ofType('color')
          .forEach((t) => paths.push(t.path));

        expect(paths.length).toBe(4);
      });
    });

    describe('map()', () => {
      it('should transform tokens', () => {
        const names = processor
          .query()
          .ofType('dimension')
          .map((t) => t.name);

        expect(names).toContain('sm');
        expect(names).toContain('md');
        expect(names).toContain('lg');
      });
    });

    describe('reduce()', () => {
      it('should reduce tokens', () => {
        const combined = processor
          .query()
          .ofType('dimension')
          .reduce((acc, t) => acc + t.name + ',', '');

        expect(combined).toContain('sm');
        expect(combined).toContain('md');
        expect(combined).toContain('lg');
      });
    });
  });
});
