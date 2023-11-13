import type { SerovalNode, SerovalPromiseConstructorNode, SerovalPromiseRejectNode, SerovalPromiseResolveNode, SerovalReadableStreamCloseNode, SerovalReadableStreamConstructorNode, SerovalReadableStreamEnqueueNode, SerovalReadableStreamErrorNode } from '../types';
import type { BaseSerializerContextOptions } from '../serializer-context.old';
import BaseSerializerContext from '../serializer-context.old';
import type { SerovalMode } from '../plugin';
export type VanillaSerializerContextOptions = BaseSerializerContextOptions;
export default class VanillaSerializerContext extends BaseSerializerContext {
    readonly mode: SerovalMode;
    /**
     * Map tree refs to actual refs
     * @private
     */
    valid: Map<string | number, number>;
    /**
     * Variables
     * @private
     */
    vars: (string | undefined)[];
    /**
     * Increments the number of references the referenced value has
     */
    markRef(current: number): void;
    /**
     * Creates the reference param (identifier) from the given reference ID
     * Calling this function means the value has been referenced somewhere
     */
    getRefParam(index: number | string): string;
    protected assignIndexedValue(index: number, value: string): string;
    protected serializePromiseConstructor(node: SerovalPromiseConstructorNode): string;
    protected serializePromiseResolve(node: SerovalPromiseResolveNode): string;
    protected serializePromiseReject(node: SerovalPromiseRejectNode): string;
    protected serializeReadableStreamConstructor(node: SerovalReadableStreamConstructorNode): string;
    protected serializeReadableStreamEnqueue(node: SerovalReadableStreamEnqueueNode): string;
    protected serializeReadableStreamError(node: SerovalReadableStreamErrorNode): string;
    protected serializeReadableStreamClose(node: SerovalReadableStreamCloseNode): string;
    serializeTop(tree: SerovalNode): string;
}
//# sourceMappingURL=serialize.d.ts.map