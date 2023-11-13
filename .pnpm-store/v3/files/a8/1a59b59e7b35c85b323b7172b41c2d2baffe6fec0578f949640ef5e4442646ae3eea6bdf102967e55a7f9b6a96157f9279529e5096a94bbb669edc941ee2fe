import type { Plugin, PluginAccessOptions, SerovalMode } from './plugin';
import type { SerovalIndexedValueNode, SerovalReferenceNode } from './types';
export interface BaseParserContextOptions extends PluginAccessOptions {
    disabledFeatures?: number;
    refs?: Map<unknown, number>;
}
export declare abstract class BaseParserContext implements PluginAccessOptions {
    abstract readonly mode: SerovalMode;
    features: number;
    marked: Set<number>;
    refs: Map<unknown, number>;
    plugins?: Plugin<any, any>[] | undefined;
    constructor(options: BaseParserContextOptions);
    protected markRef(id: number): void;
    protected isMarked(id: number): boolean;
    protected getReference<T>(current: T): number | SerovalIndexedValueNode | SerovalReferenceNode;
    protected getStrictReference<T>(current: T): SerovalIndexedValueNode | SerovalReferenceNode;
    /**
     * @private
     */
    protected isIterable(value: unknown): value is Iterable<unknown>;
}
//# sourceMappingURL=parser-context.d.ts.map