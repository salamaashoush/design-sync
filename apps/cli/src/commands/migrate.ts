import { logger } from "@design-sync/manager";
import {
  detectTokenFormat,
  generateMigrationReport,
  migrateTokens,
  type MigrationOptions,
} from "@design-sync/w3c-dtfm";
import { defineCommand } from "citty";
import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { CLIError, handleCommandError } from "../utils/errors";

export default defineCommand({
  meta: {
    name: "migrate",
    description: "Migrate tokens from legacy format to W3C format",
  },
  args: {
    input: {
      type: "positional",
      description: "Path to the input token file (JSON)",
      required: true,
    },
    output: {
      type: "string",
      alias: "o",
      description: "Path to the output file (defaults to input file with .w3c suffix)",
    },
    dryRun: {
      type: "boolean",
      alias: "d",
      description: "Show what would be migrated without writing files",
      default: false,
    },
    report: {
      type: "boolean",
      alias: "r",
      description: "Generate a detailed migration report",
      default: false,
    },
    convertRefs: {
      type: "boolean",
      description: "Convert curly brace aliases to $ref format",
      default: false,
    },
    preserveHex: {
      type: "boolean",
      description: "Preserve hex values in color objects",
      default: true,
    },
    toLegacy: {
      type: "boolean",
      description: "Convert to legacy format instead of W3C format",
      default: false,
    },
  },
  async run({ args }) {
    try {
      const { input, output, dryRun, report, convertRefs, preserveHex, toLegacy } = args;

      const inputPath = resolve(process.cwd(), input);
      logger.info(`Reading tokens from: ${inputPath}`);

      const content = await readFile(inputPath, "utf-8");
      let tokens: Record<string, unknown>;

      try {
        tokens = JSON.parse(content);
      } catch {
        throw new CLIError("Failed to parse input file as JSON");
      }

      const currentFormat = detectTokenFormat(tokens);
      logger.info(`Detected format: ${currentFormat}`);

      if (report) {
        const reportData = generateMigrationReport(tokens);
        logger.info("\n--- Migration Report ---");
        logger.info(`Current format: ${reportData.analysis.format}`);
        logger.info(`Legacy values: ${reportData.analysis.legacyCount}`);
        logger.info(`W3C values: ${reportData.analysis.w3cCount}`);
        logger.info("\nEstimated changes:");
        logger.info(`  Colors: ${reportData.estimatedChanges.colors}`);
        logger.info(`  Dimensions: ${reportData.estimatedChanges.dimensions}`);
        logger.info(`  Durations: ${reportData.estimatedChanges.durations}`);
        logger.info(`  Aliases: ${reportData.estimatedChanges.aliases}`);
        logger.info("\nRecommendations:");
        for (const rec of reportData.recommendations) {
          logger.info(`  - ${rec}`);
        }
        logger.info("------------------------\n");
      }

      const migrationOptions: MigrationOptions = {
        warnings: true,
        convertAliasesToRefs: convertRefs,
        preserveHexInColors: preserveHex,
        targetFormat: toLegacy ? "legacy" : "w3c",
      };

      const result = migrateTokens(tokens, migrationOptions);

      logger.info("Migration complete:");
      logger.info(`  Tokens processed: ${result.stats.tokensProcessed}`);
      logger.info(`  Values converted: ${result.stats.valuesConverted}`);
      logger.info(`  Errors encountered: ${result.stats.errorsEncountered}`);

      if (result.warnings.length > 0) {
        logger.warn("\nWarnings:");
        for (const warning of result.warnings) {
          logger.warn(`  [${warning.type}] ${warning.path}: ${warning.message}`);
        }
      }

      if (dryRun) {
        logger.info("\n--- Dry Run: No files written ---");
        logger.info("Preview of migrated tokens:");
        logger.info(JSON.stringify(result.tokens, null, 2).slice(0, 1000) + "...");
        return;
      }

      let outputPath: string;
      if (output) {
        outputPath = resolve(process.cwd(), output);
      } else {
        const dir = dirname(inputPath);
        const name = basename(inputPath, extname(inputPath));
        const ext = extname(inputPath);
        const suffix = toLegacy ? ".legacy" : ".w3c";
        outputPath = resolve(dir, `${name}${suffix}${ext}`);
      }

      await writeFile(outputPath, JSON.stringify(result.tokens, null, 2), "utf-8");
      logger.success(`Migrated tokens written to: ${outputPath}`);
    } catch (error) {
      handleCommandError(error, logger);
    }
  },
});
