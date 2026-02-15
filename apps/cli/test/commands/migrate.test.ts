import { afterEach, describe, expect, it, spyOn } from 'bun:test';
import migrateCommand from '../../src/commands/migrate';

describe('migrate command', () => {
  describe('command definition', () => {
    it('should export a citty command', () => {
      expect(migrateCommand).toBeDefined();
      expect(migrateCommand.meta).toBeDefined();
      expect(migrateCommand.args).toBeDefined();
      expect(migrateCommand.run).toBeDefined();
    });

    it('should have correct meta name', () => {
      const meta = migrateCommand.meta as { name: string; description: string };
      expect(meta.name).toBe('migrate');
    });

    it('should have correct meta description', () => {
      const meta = migrateCommand.meta as { name: string; description: string };
      expect(meta.description).toBe('Migrate tokens from legacy format to W3C format');
    });
  });

  describe('arguments', () => {
    const args = migrateCommand.args as Record<string, any>;

    it('should have input as a required positional argument', () => {
      expect(args.input).toBeDefined();
      expect(args.input.type).toBe('positional');
      expect(args.input.required).toBe(true);
      expect(args.input.description).toContain('input token file');
    });

    it('should have output argument with alias', () => {
      expect(args.output).toBeDefined();
      expect(args.output.type).toBe('string');
      expect(args.output.alias).toBe('o');
      expect(args.output.description).toContain('output file');
    });

    it('should have dryRun argument with alias and default', () => {
      expect(args.dryRun).toBeDefined();
      expect(args.dryRun.type).toBe('boolean');
      expect(args.dryRun.alias).toBe('d');
      expect(args.dryRun.default).toBe(false);
      expect(args.dryRun.description).toContain('without writing');
    });

    it('should have report argument with alias and default', () => {
      expect(args.report).toBeDefined();
      expect(args.report.type).toBe('boolean');
      expect(args.report.alias).toBe('r');
      expect(args.report.default).toBe(false);
      expect(args.report.description).toContain('migration report');
    });

    it('should have convertRefs argument', () => {
      expect(args.convertRefs).toBeDefined();
      expect(args.convertRefs.type).toBe('boolean');
      expect(args.convertRefs.default).toBe(false);
      expect(args.convertRefs.description).toContain('$ref');
    });

    it('should have preserveHex argument with true default', () => {
      expect(args.preserveHex).toBeDefined();
      expect(args.preserveHex.type).toBe('boolean');
      expect(args.preserveHex.default).toBe(true);
      expect(args.preserveHex.description).toContain('hex');
    });

    it('should have toLegacy argument', () => {
      expect(args.toLegacy).toBeDefined();
      expect(args.toLegacy.type).toBe('boolean');
      expect(args.toLegacy.default).toBe(false);
      expect(args.toLegacy.description).toContain('legacy format');
    });
  });

  describe('run function', () => {
    let exitSpy: ReturnType<typeof spyOn>;

    afterEach(() => {
      exitSpy?.mockRestore();
    });

    it('should be a function', () => {
      expect(typeof migrateCommand.run).toBe('function');
    });

    it('should handle missing input file', async () => {
      exitSpy = spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      // Running with a non-existent file should trigger error handling
      await expect(
        migrateCommand.run!({ args: { input: '/nonexistent/file.json' } } as any),
      ).rejects.toThrow();
    });

    it('should handle invalid JSON', async () => {
      const { writeFile, unlink } = await import('node:fs/promises');
      const { join } = await import('node:path');
      const os = await import('node:os');

      const tempFile = join(os.tmpdir(), `test-invalid-${Date.now()}.json`);
      await writeFile(tempFile, 'not valid json');

      exitSpy = spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      await expect(migrateCommand.run!({ args: { input: tempFile } } as any)).rejects.toThrow(
        'process.exit called',
      );

      await unlink(tempFile);
    });

    it('should process valid tokens file in dry-run mode', async () => {
      const { writeFile, unlink } = await import('node:fs/promises');
      const { join } = await import('node:path');
      const os = await import('node:os');

      const tempFile = join(os.tmpdir(), `test-tokens-${Date.now()}.json`);
      const tokens = {
        colors: {
          primary: {
            $type: 'color',
            $value: '#ff0000',
          },
        },
      };
      await writeFile(tempFile, JSON.stringify(tokens));

      // Dry run should not throw
      await migrateCommand.run!({
        args: {
          input: tempFile,
          dryRun: true,
          report: false,
          convertRefs: false,
          preserveHex: true,
          toLegacy: false,
        },
      } as any);

      await unlink(tempFile);
    });

    it('should write output file when not in dry-run mode', async () => {
      const { writeFile, unlink, readFile, access } = await import('node:fs/promises');
      const { join } = await import('node:path');
      const os = await import('node:os');

      const tempFile = join(os.tmpdir(), `test-tokens-${Date.now()}.json`);
      const outputFile = join(os.tmpdir(), `test-tokens-${Date.now()}.w3c.json`);

      const tokens = {
        colors: {
          primary: {
            $type: 'color',
            $value: '#ff0000',
          },
        },
      };
      await writeFile(tempFile, JSON.stringify(tokens));

      await migrateCommand.run!({
        args: {
          input: tempFile,
          output: outputFile,
          dryRun: false,
          report: false,
          convertRefs: false,
          preserveHex: true,
          toLegacy: false,
        },
      } as any);

      // Verify output file was created
      await access(outputFile);
      const outputContent = await readFile(outputFile, 'utf-8');
      const outputTokens = JSON.parse(outputContent);
      expect(outputTokens.colors.primary.$type).toBe('color');

      await unlink(tempFile);
      await unlink(outputFile);
    });
  });
});
