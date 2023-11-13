import type { SerovalNode } from '../types';
import type { Plugin, PluginAccessOptions } from '../plugin';
export interface DeserializerOptions extends PluginAccessOptions {
    markedRefs: number[] | Set<number>;
}
export default class VanillaDeserializerContext implements PluginAccessOptions {
    /**
     * Mapping ids to values
     * @private
     */
    values: Map<number, unknown>;
    /**
     * Which refs are pre-marked
     * @private
     */
    refs: Set<number>;
    plugins?: Plugin<any, any>[] | undefined;
    constructor(options: DeserializerOptions);
    assignIndexedValue<T>(index: number, value: T): T;
    private deserializeReference;
    private deserializeArray;
    private deserializeProperties;
    private deserializeObject;
    private deserializeDate;
    private deserializeRegExp;
    private deserializeSet;
    private deserializeMap;
    private deserializeArrayBuffer;
    private deserializeTypedArray;
    private deserializeDataView;
    private deserializeDictionary;
    private deserializeAggregateError;
    private deserializeError;
    private deserializePromise;
    private deserializeURL;
    private deserializeURLSearchParams;
    private deserializeBlob;
    private deserializeFile;
    private deserializeHeaders;
    private deserializeFormData;
    private deserializeBoxed;
    private deserializeRequest;
    private deserializeResponse;
    private deserializeEvent;
    private deserializeCustomEvent;
    private deserializeDOMException;
    private deserializePlugin;
    deserialize(node: SerovalNode): unknown;
}
//# sourceMappingURL=deserialize.d.ts.map