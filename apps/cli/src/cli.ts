import { logger } from "@design-sync/manager";
import { defineCommand, runMain } from "citty";
import cliPkg from "../package.json";

// Global error handlers for uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection:", reason);
  process.exit(1);
});

// Graceful shutdown handlers
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}, shutting down...`);
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

const main = defineCommand({
  meta: {
    name: cliPkg.name,
    description: "DesignSync CLI",
    version: cliPkg.version,
  },
  subCommands: {
    sync: () => import("./commands/sync").then((r) => r.default),
    init: () => import("./commands/init").then((r) => r.default),
    migrate: () => import("./commands/migrate").then((r) => r.default),
  },
});

runMain(main);
