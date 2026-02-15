/**
 * @deprecated The walker module is deprecated. Use the new processor API instead.
 *
 * Migration guide:
 * - `TokensWalker` → `createTokenProcessor()`
 * - `WalkerDesignToken` → `Token` from processor
 * - `TokensWalkerSchemaExtension` → `Extension` from processor
 * - `colorGeneratorsExtension` → `processorColorGenerators`
 * - `colorModifiersExtension` → `processorColorModifiers`
 *
 * @example
 * // Before (walker)
 * import { TokensWalker } from '@design-sync/w3c-dtfm';
 * const walker = new TokensWalker(tokens, options);
 * walker.walk(token => console.log(token.path));
 *
 * // After (processor)
 * import { createTokenProcessor } from '@design-sync/w3c-dtfm';
 * const processor = createTokenProcessor(tokens, options);
 * await processor.process();
 * processor.tokens.forEach(token => console.log(token.path));
 *
 * @module walker
 */
export * from "./extensions/generators";
export * from "./extensions/modifiers";
export * from "./extensions/responsive";
export * from "./token";
export * from "./types";
export * from "./utils";
export * from "./walker";
