import type { logger as LoggerType } from "@design-sync/manager";

type Logger = typeof LoggerType;

/**
 * Custom error class for CLI-specific errors with exit codes.
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public exitCode = 1,
  ) {
    super(message);
    this.name = "CLIError";
  }
}

/**
 * Handles command errors consistently across all CLI commands.
 * Logs the error and exits with the appropriate code.
 */
export function handleCommandError(error: unknown, logger: Logger): never {
  if (error instanceof CLIError) {
    logger.error(error.message);
    process.exit(error.exitCode);
  }

  if (error instanceof Error) {
    logger.error(error.message);
    if (process.env.DEBUG) {
      logger.error(error.stack);
    }
  } else {
    logger.error("An unexpected error occurred:", error);
  }

  process.exit(1);
}

/**
 * Wraps an async command handler with consistent error handling.
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<void>>(
  handler: T,
  logger: Logger,
): T {
  return (async (...args: Parameters<T>) => {
    try {
      await handler(...args);
    } catch (error) {
      handleCommandError(error, logger);
    }
  }) as T;
}
