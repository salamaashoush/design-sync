/**
 * Design Token Types
 *
 * This file re-exports from the types folder for backwards compatibility.
 * All types are now organized in:
 * - types/w3c.ts - W3C-compliant types (recommended)
 * - types/legacy.ts - Legacy types (deprecated)
 * - types/index.ts - Unified types that accept both formats
 */

export * from "./types/index";

// Re-export GradientStop for backwards compatibility
export type { W3CGradientStop as GradientStop } from "./types/w3c";
