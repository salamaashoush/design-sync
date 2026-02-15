import { describe, expect, it } from 'bun:test';
import {
  generateCJSConfigTemplate,
  generateConfigTemplate,
  generateESMConfigTemplate,
  type ConfigTemplateOptions,
} from '../../src/commands/init';

describe('init command', () => {
  const defaultOptions: ConfigTemplateOptions = {
    uri: 'gh:user/repo/tokens#main',
    out: 'src/tokens',
    plugins: ['css', 'json'],
    prettify: true,
  };

  describe('generateESMConfigTemplate', () => {
    it('should generate ESM config with correct imports', () => {
      const template = generateESMConfigTemplate(defaultOptions);

      expect(template).toContain("import { defineConfig } from '@design-sync/cli'");
      expect(template).toContain("import { cssPlugin } from '@design-sync/css-plugin'");
      expect(template).toContain("import { jsonPlugin } from '@design-sync/json-plugin'");
    });

    it('should include the uri and out paths', () => {
      const template = generateESMConfigTemplate(defaultOptions);

      expect(template).toContain('uri:  "gh:user/repo/tokens#main"');
      expect(template).toContain('out:  "src/tokens"');
    });

    it('should include plugin calls', () => {
      const template = generateESMConfigTemplate(defaultOptions);

      expect(template).toContain('plugins: [cssPlugin(), jsonPlugin()]');
    });

    it('should include prettify setting', () => {
      const template = generateESMConfigTemplate(defaultOptions);

      expect(template).toContain('prettify: true');
    });

    it('should use export default', () => {
      const template = generateESMConfigTemplate(defaultOptions);

      expect(template).toContain('export default defineConfig({');
    });

    it('should handle vanilla-extract plugin with camelCase', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        plugins: ['vanilla-extract'],
      };

      const template = generateESMConfigTemplate(options);

      expect(template).toContain("import { vanillaExtractPlugin } from '@design-sync/vanilla-extract-plugin'");
      expect(template).toContain('plugins: [vanillaExtractPlugin()]');
    });

    it('should handle styled-components plugin with camelCase', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        plugins: ['styled-components'],
      };

      const template = generateESMConfigTemplate(options);

      expect(template).toContain(
        "import { styledComponentsPlugin } from '@design-sync/styled-components-plugin'",
      );
      expect(template).toContain('plugins: [styledComponentsPlugin()]');
    });
  });

  describe('generateCJSConfigTemplate', () => {
    it('should generate CJS config with require statements', () => {
      const template = generateCJSConfigTemplate(defaultOptions);

      expect(template).toContain("const { defineConfig } = require('@design-sync/cli')");
      expect(template).toContain("const cssPlugin = require('@design-sync/css-plugin')");
      expect(template).toContain("const jsonPlugin = require('@design-sync/json-plugin')");
    });

    it('should use module.exports', () => {
      const template = generateCJSConfigTemplate(defaultOptions);

      expect(template).toContain('module.exports = defineConfig({');
    });

    it('should include the uri and out paths', () => {
      const template = generateCJSConfigTemplate(defaultOptions);

      expect(template).toContain('uri:  "gh:user/repo/tokens#main"');
      expect(template).toContain('out:  "src/tokens"');
    });

    it('should include plugin calls', () => {
      const template = generateCJSConfigTemplate(defaultOptions);

      expect(template).toContain('plugins: [cssPlugin(), jsonPlugin()]');
    });

    it('should include prettify setting', () => {
      const template = generateCJSConfigTemplate(defaultOptions);

      expect(template).toContain('prettify: true');
    });

    it('should handle vanilla-extract plugin with camelCase', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        plugins: ['vanilla-extract'],
      };

      const template = generateCJSConfigTemplate(options);

      expect(template).toContain(
        "const vanillaExtractPlugin = require('@design-sync/vanilla-extract-plugin')",
      );
      expect(template).toContain('plugins: [vanillaExtractPlugin()]');
    });
  });

  describe('generateConfigTemplate', () => {
    it('should return CJS template when isCJS is true', () => {
      const template = generateConfigTemplate(defaultOptions, true);

      expect(template).toContain('module.exports');
      expect(template).toContain('require(');
    });

    it('should return ESM template when isCJS is false', () => {
      const template = generateConfigTemplate(defaultOptions, false);

      expect(template).toContain('export default');
      expect(template).toContain('import {');
    });
  });

  describe('plugin camelCase conversion', () => {
    it('should handle single word plugin names', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        plugins: ['css'],
      };

      const template = generateESMConfigTemplate(options);

      expect(template).toContain("import { cssPlugin } from '@design-sync/css-plugin'");
      expect(template).toContain('plugins: [cssPlugin()]');
    });

    it('should handle hyphenated plugin names', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        plugins: ['styled-components'],
      };

      const template = generateESMConfigTemplate(options);

      expect(template).toContain(
        "import { styledComponentsPlugin } from '@design-sync/styled-components-plugin'",
      );
      expect(template).toContain('plugins: [styledComponentsPlugin()]');
    });

    it('should handle multiple plugins', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        plugins: ['css', 'json', 'vanilla-extract'],
      };

      const template = generateESMConfigTemplate(options);

      expect(template).toContain("import { cssPlugin } from '@design-sync/css-plugin'");
      expect(template).toContain("import { jsonPlugin } from '@design-sync/json-plugin'");
      expect(template).toContain("import { vanillaExtractPlugin } from '@design-sync/vanilla-extract-plugin'");
      expect(template).toContain('plugins: [cssPlugin(), jsonPlugin(), vanillaExtractPlugin()]');
    });
  });

  describe('prettify option', () => {
    it('should set prettify to false when disabled', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        prettify: false,
      };

      const esmTemplate = generateESMConfigTemplate(options);
      const cjsTemplate = generateCJSConfigTemplate(options);

      expect(esmTemplate).toContain('prettify: false');
      expect(cjsTemplate).toContain('prettify: false');
    });

    it('should set prettify to true when enabled', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        prettify: true,
      };

      const esmTemplate = generateESMConfigTemplate(options);
      const cjsTemplate = generateCJSConfigTemplate(options);

      expect(esmTemplate).toContain('prettify: true');
      expect(cjsTemplate).toContain('prettify: true');
    });
  });

  describe('uri and out paths', () => {
    it('should handle complex URIs', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        uri: 'gh:org/design-system/packages/tokens/src#feature/new-colors',
      };

      const template = generateESMConfigTemplate(options);

      expect(template).toContain('uri:  "gh:org/design-system/packages/tokens/src#feature/new-colors"');
    });

    it('should handle nested output paths', () => {
      const options: ConfigTemplateOptions = {
        ...defaultOptions,
        out: 'src/styles/design-system/tokens',
      };

      const template = generateESMConfigTemplate(options);

      expect(template).toContain('out:  "src/styles/design-system/tokens"');
    });
  });
});
