import type { SerovalPromiseConstructorNode, SerovalPromiseResolveNode, SerovalPromiseRejectNode, SerovalReadableStreamCloseNode, SerovalReadableStreamEnqueueNode, SerovalReadableStreamErrorNode, SerovalReadableStreamConstructorNode, SerovalNode } from '../types';
import type { BaseSerializerContextOptions } from '../serializer-context.old';
import BaseSerializerContext from '../serializer-context.old';
import type { SerovalMode } from '../plugin';
import type { CrossContextOptions } from './cross-parser';
export interface CrossSerializerContextOptions extends BaseSerializerContextOptions, CrossContextOptions {
}
export default class CrossSerializerContext extends BaseSerializerContext {
    readonly mode: SerovalMode;
    scopeId?: string;
    constructor(options: CrossSerializerContextOptions);
    getRefParam(id: number | string): string;
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