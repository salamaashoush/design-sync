import { ac as QueryObserverResult, b as QueryClient, K as QueryObserverOptions, aG as NotifyOptions, l as Query, p as QueryKey, c as QueryObserver } from './queryClient-5b892aba.js';
import { Subscribable } from './subscribable.js';
import './removable.js';

type QueriesObserverListener = (result: Array<QueryObserverResult>) => void;
interface QueriesObserverOptions<TCombinedResult = Array<QueryObserverResult>> {
    combine?: (result: Array<QueryObserverResult>) => TCombinedResult;
}
declare class QueriesObserver<TCombinedResult = Array<QueryObserverResult>> extends Subscribable<QueriesObserverListener> {
    #private;
    constructor(client: QueryClient, queries: Array<QueryObserverOptions>, options?: QueriesObserverOptions<TCombinedResult>);
    protected onSubscribe(): void;
    protected onUnsubscribe(): void;
    destroy(): void;
    setQueries(queries: Array<QueryObserverOptions>, options?: QueriesObserverOptions<TCombinedResult>, notifyOptions?: NotifyOptions): void;
    getCurrentResult(): TCombinedResult;
    getQueries(): Query<unknown, Error, unknown, QueryKey>[];
    getObservers(): QueryObserver<unknown, Error, unknown, unknown, QueryKey>[];
    getOptimisticResult(queries: Array<QueryObserverOptions>): [
        rawResult: Array<QueryObserverResult>,
        combineResult: (r?: Array<QueryObserverResult>) => TCombinedResult,
        trackResult: () => Array<QueryObserverResult>
    ];
}

export { QueriesObserver, QueriesObserverOptions };
