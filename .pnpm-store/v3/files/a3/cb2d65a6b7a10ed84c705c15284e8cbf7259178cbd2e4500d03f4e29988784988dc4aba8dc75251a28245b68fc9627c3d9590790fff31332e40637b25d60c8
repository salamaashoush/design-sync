import { BaseParserContext } from '../parser-context';
import type { SerovalNode, SerovalPlainRecordNode } from '../types';
export default abstract class BaseAsyncParserContext extends BaseParserContext {
    private parseItems;
    private parseArray;
    private parseBoxed;
    private parseTypedArray;
    private parseBigIntTypedArray;
    private parseDataView;
    private parseProperties;
    private parsePlainObject;
    private parseError;
    private parseMap;
    private parseSet;
    private parseBlob;
    private parseFile;
    protected parsePlainProperties(entries: [key: string, value: unknown][]): Promise<SerovalPlainRecordNode>;
    private parseHeaders;
    private parseFormData;
    private parseRequest;
    private parseResponse;
    private parseEvent;
    private parseCustomEvent;
    private parseAggregateError;
    private parsePromise;
    private parsePlugin;
    private parseObject;
    parse<T>(current: T): Promise<SerovalNode>;
}
//# sourceMappingURL=async.d.ts.map