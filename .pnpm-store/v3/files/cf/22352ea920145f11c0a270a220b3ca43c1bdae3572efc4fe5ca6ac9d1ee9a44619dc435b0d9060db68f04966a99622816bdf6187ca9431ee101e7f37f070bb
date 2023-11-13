import { D as DefaultError, z as InfiniteData, p as QueryKey, c as QueryObserver, aj as InfiniteQueryObserverResult, aF as ObserverFetchOptions, b as QueryClient, O as InfiniteQueryObserverOptions, aG as NotifyOptions, S as DefaultedInfiniteQueryObserverOptions, a2 as FetchNextPageOptions, a3 as FetchPreviousPageOptions, l as Query } from './queryClient-5b892aba.js';
import './removable.js';
import './subscribable.js';

type InfiniteQueryObserverListener<TData, TError> = (result: InfiniteQueryObserverResult<TData, TError>) => void;
declare class InfiniteQueryObserver<TQueryFnData = unknown, TError = DefaultError, TData = InfiniteData<TQueryFnData>, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown> extends QueryObserver<TQueryFnData, TError, TData, InfiniteData<TQueryData, TPageParam>, TQueryKey> {
    subscribe: (listener?: InfiniteQueryObserverListener<TData, TError>) => () => void;
    getCurrentResult: () => InfiniteQueryObserverResult<TData, TError>;
    protected fetch: (fetchOptions: ObserverFetchOptions) => Promise<InfiniteQueryObserverResult<TData, TError>>;
    constructor(client: QueryClient, options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>);
    protected bindMethods(): void;
    setOptions(options?: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>, notifyOptions?: NotifyOptions): void;
    getOptimisticResult(options: DefaultedInfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>): InfiniteQueryObserverResult<TData, TError>;
    fetchNextPage(options?: FetchNextPageOptions): Promise<InfiniteQueryObserverResult<TData, TError>>;
    fetchPreviousPage(options?: FetchPreviousPageOptions): Promise<InfiniteQueryObserverResult<TData, TError>>;
    protected createResult(query: Query<TQueryFnData, TError, InfiniteData<TQueryData, TPageParam>, TQueryKey>, options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>): InfiniteQueryObserverResult<TData, TError>;
}

export { InfiniteQueryObserver };
