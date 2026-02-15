import { describe, expect, it } from 'bun:test';
import syncCommand from '../../src/commands/sync';

describe('sync command', () => {
  describe('command definition', () => {
    it('should export a citty command', () => {
      expect(syncCommand).toBeDefined();
      expect(syncCommand.meta).toBeDefined();
      expect(syncCommand.args).toBeDefined();
      expect(syncCommand.run).toBeDefined();
    });

    it('should have correct meta name', () => {
      // citty meta can be a value or promise, cast for testing
      const meta = syncCommand.meta as { name: string; description: string };
      expect(meta.name).toBe('sync');
    });

    it('should have correct meta description', () => {
      const meta = syncCommand.meta as { name: string; description: string };
      expect(meta.description).toBe('Sync tokens from the git repo');
    });
  });

  describe('arguments', () => {
    // Cast args for testing since citty uses Resolvable wrapper
    const args = syncCommand.args as Record<string, any>;

    it('should have uri as a positional argument', () => {
      expect(args.uri).toBeDefined();
      expect(args.uri.type).toBe('positional');
      expect(args.uri.required).toBe(false);
      expect(args.uri.valueHint).toBe('gh:username/repo/path/to/files#branch');
    });

    it('should have out argument', () => {
      expect(args.out).toBeDefined();
      expect(args.out.type).toBe('string');
      expect(args.out.description).toBe('path to output file');
    });

    it('should have config argument', () => {
      expect(args.config).toBeDefined();
      expect(args.config.type).toBe('string');
      expect(args.config.description).toBe('path to config file');
    });

    it('should have auth argument', () => {
      expect(args.auth).toBeDefined();
      expect(args.auth.type).toBe('string');
      expect(args.auth.description).toBe('git provider auth token');
    });

    it('should have cwd argument', () => {
      expect(args.cwd).toBeDefined();
      expect(args.cwd.type).toBe('string');
      expect(args.cwd.description).toBe('path to working directory');
    });

    it('should have prettify argument', () => {
      expect(args.prettify).toBeDefined();
      expect(args.prettify.type).toBe('boolean');
      expect(args.prettify.description).toBe('prettify output');
    });
  });

  describe('run function', () => {
    it('should be a function', () => {
      expect(typeof syncCommand.run).toBe('function');
    });

    it('should be defined', () => {
      expect(syncCommand.run).toBeDefined();
    });
  });
});
