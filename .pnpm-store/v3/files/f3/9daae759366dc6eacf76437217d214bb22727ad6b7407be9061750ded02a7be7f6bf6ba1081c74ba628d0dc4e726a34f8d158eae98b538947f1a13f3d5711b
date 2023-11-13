import type { BaseSyncParserContextOptions } from './sync';
import BaseSyncParserContext from './sync';
import type { SerovalNode, SerovalPluginNode } from '../types';
export interface BaseStreamParserContextOptions extends BaseSyncParserContextOptions {
    onParse: (node: SerovalNode, initial: boolean) => void;
    onError?: (error: unknown) => void;
    onDone?: () => void;
}
export default abstract class BaseStreamParserContext extends BaseSyncParserContext {
    private alive;
    private pending;
    private onParseCallback;
    private onErrorCallback?;
    private onDoneCallback?;
    constructor(options: BaseStreamParserContextOptions);
    private onParse;
    private onError;
    private onDone;
    push<T>(value: T): void;
    pushPendingState(): void;
    popPendingState(): void;
    private pushReadableStreamReader;
    private parseReadableStream;
    private parseRequest;
    private parseResponse;
    private parsePromise;
    protected parsePlugin(id: number, current: unknown): SerovalPluginNode | undefined;
    protected parseObject(id: number, current: object): SerovalNode;
    private parseWithError;
    /**
     * @private
     */
    start<T>(current: T): void;
    /**
     * @private
     */
    destroy(): void;
    isAlive(): boolean;
}
//# sourceMappingURL=stream.d.ts.map