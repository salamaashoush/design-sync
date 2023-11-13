import type { BigIntTypedArrayValue, TypedArrayValue } from '../../types';
import type { BaseParserContextOptions } from '../parser-context';
import { BaseParserContext } from '../parser-context';
import type { SerovalBoxedNode, SerovalArrayNode, SerovalNode, SerovalNullConstructorNode, SerovalObjectNode, SerovalObjectRecordNode, SerovalErrorNode, SerovalMapNode, SerovalSetNode, SerovalPluginNode, SerovalAggregateErrorNode, SerovalCustomEventNode, SerovalEventNode, SerovalHeadersNode, SerovalPlainRecordNode, SerovalFormDataNode, SerovalTypedArrayNode, SerovalBigIntTypedArrayNode, SerovalDataViewNode } from '../types';
type ObjectLikeNode = SerovalObjectNode | SerovalNullConstructorNode;
export interface BaseSyncParserContextOptions extends BaseParserContextOptions {
    refs?: Map<unknown, number>;
}
export default abstract class BaseSyncParserContext extends BaseParserContext {
    protected parseItems(current: unknown[]): SerovalNode[];
    protected parseArray(id: number, current: unknown[]): SerovalArrayNode;
    protected parseProperties(properties: Record<string, unknown>): SerovalObjectRecordNode;
    protected parsePlainObject(id: number, current: Record<string, unknown>, empty: boolean): ObjectLikeNode;
    protected parseBoxed(id: number, current: object): SerovalBoxedNode;
    protected parseTypedArray(id: number, current: TypedArrayValue): SerovalTypedArrayNode;
    protected parseBigIntTypedArray(id: number, current: BigIntTypedArrayValue): SerovalBigIntTypedArrayNode;
    protected parseDataView(id: number, current: DataView): SerovalDataViewNode;
    protected parseError(id: number, current: Error): SerovalErrorNode;
    protected parseMap(id: number, current: Map<unknown, unknown>): SerovalMapNode;
    protected parseSet(id: number, current: Set<unknown>): SerovalSetNode;
    protected parsePlainProperties(entries: [key: string, value: unknown][]): SerovalPlainRecordNode;
    protected parseHeaders(id: number, current: Headers): SerovalHeadersNode;
    protected parseFormData(id: number, current: FormData): SerovalFormDataNode;
    protected parseEvent(id: number, current: Event): SerovalEventNode;
    protected parseCustomEvent(id: number, current: CustomEvent): SerovalCustomEventNode;
    protected parseAggregateError(id: number, current: AggregateError): SerovalAggregateErrorNode;
    protected parsePlugin(id: number, current: unknown): SerovalPluginNode | undefined;
    protected parseObject(id: number, current: object): SerovalNode;
    parse<T>(current: T): SerovalNode;
}
export {};
//# sourceMappingURL=sync.d.ts.map