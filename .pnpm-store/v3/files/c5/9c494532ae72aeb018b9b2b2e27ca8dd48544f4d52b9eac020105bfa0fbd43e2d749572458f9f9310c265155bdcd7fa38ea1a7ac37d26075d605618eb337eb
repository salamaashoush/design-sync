import { SerovalObjectFlags } from './constants';
import type { Plugin, PluginAccessOptions, SerovalMode } from './plugin';
import type { SerovalArrayNode, SerovalNode, SerovalObjectRecordKey, SerovalObjectRecordNode, SerovalReferenceNode, SerovalObjectNode, SerovalNullConstructorNode, SerovalRegExpNode, SerovalDateNode, SerovalSetNode, SerovalMapNode, SerovalArrayBufferNode, SerovalTypedArrayNode, SerovalBigIntTypedArrayNode, SerovalDataViewNode, SerovalAggregateErrorNode, SerovalErrorNode, SerovalPromiseNode, SerovalWKSymbolNode, SerovalURLNode, SerovalURLSearchParamsNode, SerovalBlobNode, SerovalFileNode, SerovalHeadersNode, SerovalFormDataNode, SerovalBoxedNode, SerovalRequestNode, SerovalResponseNode, SerovalEventNode, SerovalCustomEventNode, SerovalDOMExceptionNode, SerovalPluginNode, SerovalPromiseConstructorNode, SerovalPromiseResolveNode, SerovalPromiseRejectNode, SerovalReadableStreamConstructorNode, SerovalReadableStreamEnqueueNode, SerovalReadableStreamErrorNode, SerovalReadableStreamCloseNode } from './types';
interface IndexAssignment {
    t: 'index';
    s: string;
    k: undefined;
    v: string;
}
interface SetAssignment {
    t: 'set';
    s: string;
    k: string;
    v: string;
}
interface AddAssignment {
    t: 'add';
    s: string;
    k: undefined;
    v: string;
}
interface DeleteAssignment {
    t: 'delete';
    s: string;
    k: string;
    v: undefined;
}
type Assignment = IndexAssignment | AddAssignment | SetAssignment | DeleteAssignment;
export interface FlaggedObject {
    type: SerovalObjectFlags;
    value: string;
}
declare const enum SpecialReference {
    Sentinel = 0
}
export interface BaseSerializerContextOptions extends PluginAccessOptions {
    features: number;
    markedRefs: number[] | Set<number>;
}
export default abstract class BaseSerializerContext implements PluginAccessOptions {
    /**
     * @private
     */
    features: number;
    /**
     * To check if an object is synchronously referencing itself
     * @private
     */
    stack: number[];
    /**
     * Array of object mutations
     * @private
     */
    flags: FlaggedObject[];
    /**
     * Array of assignments to be done (used for recursion)
     * @private
     */
    assignments: Assignment[];
    plugins?: Plugin<any, any>[] | undefined;
    /**
     * Refs that are...referenced
     * @private
     */
    marked: Set<number>;
    constructor(options: BaseSerializerContextOptions);
    abstract readonly mode: SerovalMode;
    /**
     * A tiny function that tells if a reference
     * is to be accessed. This is a requirement for
     * deciding whether or not we should generate
     * an identifier for the object
     */
    protected markRef(id: number): void;
    protected isMarked(id: number): boolean;
    /**
     * Converts the ID of a reference into a identifier string
     * that is used to refer to the object instance in the
     * generated script.
     */
    abstract getRefParam(id: number | string): string;
    private specials;
    /**
     * Generates special references that isn't provided by the user
     * but by the script.
     */
    protected getSpecialReference(ref: SpecialReference): string;
    protected pushObjectFlag(flag: SerovalObjectFlags, id: number): void;
    private resolveFlags;
    protected resolvePatches(): string | undefined;
    /**
     * Generates the inlined assignment for the reference
     * This is different from the assignments array as this one
     * signifies creation rather than mutation
     */
    protected createAssignment(source: string, value: string): void;
    protected createAddAssignment(ref: number, value: string): void;
    protected createSetAssignment(ref: number, key: string, value: string): void;
    protected createDeleteAssignment(ref: number, key: string): void;
    protected createArrayAssign(ref: number, index: number | string, value: string): void;
    protected createObjectAssign(ref: number, key: string, value: string): void;
    /**
     * Checks if the value is in the stack. Stack here is a reference
     * structure to know if a object is to be accessed in a TDZ.
     */
    isIndexedValueInStack(node: SerovalNode): boolean;
    /**
     * Produces an assignment expression. `id` generates a reference
     * parameter (through `getRefParam`) and has the option to
     * return the reference parameter directly or assign a value to
     * it.
     */
    protected abstract assignIndexedValue(id: number, value: string): string;
    protected serializeReference(node: SerovalReferenceNode): string;
    protected getIterableAccess(): string;
    protected serializeIterable(node: SerovalNode): string;
    protected serializeArrayItem(id: number, item: SerovalNode | undefined, index: number): string;
    protected serializeArray(node: SerovalArrayNode): string;
    protected serializeProperty(id: number, key: SerovalObjectRecordKey, val: SerovalNode): string;
    protected serializeProperties(sourceID: number, node: SerovalObjectRecordNode): string;
    protected serializeObject(node: SerovalObjectNode): string;
    protected serializeWithObjectAssign(value: SerovalObjectRecordNode, id: number, serialized: string): string;
    protected serializeAssignment(sourceID: number, mainAssignments: Assignment[], key: SerovalObjectRecordKey, value: SerovalNode): void;
    protected serializeAssignments(sourceID: number, node: SerovalObjectRecordNode): string | undefined;
    protected serializeDictionary(i: number, p: SerovalObjectRecordNode | undefined, init: string): string;
    protected serializeNullConstructor(node: SerovalNullConstructorNode): string;
    protected serializeDate(node: SerovalDateNode): string;
    protected serializeRegExp(node: SerovalRegExpNode): string;
    protected serializeSetItem(id: number, item: SerovalNode): string;
    protected serializeSet(node: SerovalSetNode): string;
    protected serializeMapEntry(id: number, key: SerovalNode, val: SerovalNode): string;
    protected serializeMap(node: SerovalMapNode): string;
    protected serializeArrayBuffer(node: SerovalArrayBufferNode): string;
    protected serializeTypedArray(node: SerovalTypedArrayNode | SerovalBigIntTypedArrayNode): string;
    protected serializeDataView(node: SerovalDataViewNode): string;
    protected serializeAggregateError(node: SerovalAggregateErrorNode): string;
    protected serializeError(node: SerovalErrorNode): string;
    protected serializePromise(node: SerovalPromiseNode): string;
    protected serializeWKSymbol(node: SerovalWKSymbolNode): string;
    protected serializeURL(node: SerovalURLNode): string;
    protected serializeURLSearchParams(node: SerovalURLSearchParamsNode): string;
    protected serializeBlob(node: SerovalBlobNode): string;
    protected serializeFile(node: SerovalFileNode): string;
    protected serializeHeaders(node: SerovalHeadersNode): string;
    protected serializeFormDataEntry(id: number, key: string, value: SerovalNode): string;
    protected serializeFormDataEntries(node: SerovalFormDataNode, size: number): string;
    protected serializeFormData(node: SerovalFormDataNode): string;
    protected serializeBoxed(node: SerovalBoxedNode): string;
    protected serializeRequest(node: SerovalRequestNode): string;
    protected serializeResponse(node: SerovalResponseNode): string;
    protected serializeEvent(node: SerovalEventNode): string;
    protected serializeCustomEvent(node: SerovalCustomEventNode): string;
    protected serializeDOMException(node: SerovalDOMExceptionNode): string;
    protected serializePlugin(node: SerovalPluginNode): string;
    protected abstract serializePromiseConstructor(node: SerovalPromiseConstructorNode): string;
    protected abstract serializePromiseResolve(node: SerovalPromiseResolveNode): string;
    protected abstract serializePromiseReject(node: SerovalPromiseRejectNode): string;
    protected abstract serializeReadableStreamConstructor(node: SerovalReadableStreamConstructorNode): string;
    protected abstract serializeReadableStreamEnqueue(node: SerovalReadableStreamEnqueueNode): string;
    protected abstract serializeReadableStreamError(node: SerovalReadableStreamErrorNode): string;
    protected abstract serializeReadableStreamClose(node: SerovalReadableStreamCloseNode): string;
    serialize(node: SerovalNode): string;
}
export {};
//# sourceMappingURL=serializer-context.old.d.ts.map