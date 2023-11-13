import type { CrossAsyncParserContextOptions } from './async';
import type { CrossContextOptions } from './cross-parser';
import type { CrossStreamParserContextOptions } from './stream';
import type { CrossSyncParserContextOptions } from './sync';
export interface CrossSerializeOptions extends CrossSyncParserContextOptions, CrossContextOptions {
}
export declare function crossSerialize<T>(source: T, options?: CrossSerializeOptions): string;
export interface CrossSerializeAsyncOptions extends CrossAsyncParserContextOptions, CrossContextOptions {
}
export declare function crossSerializeAsync<T>(source: T, options?: CrossSerializeAsyncOptions): Promise<string>;
export interface CrossSerializeStreamOptions extends Omit<CrossStreamParserContextOptions, 'onParse'>, CrossContextOptions {
    onSerialize: (data: string, initial: boolean) => void;
}
export declare function crossSerializeStream<T>(source: T, options: CrossSerializeStreamOptions): () => void;
//# sourceMappingURL=index.d.ts.map