import { UseBaseQueryOptions } from './types.js';
import { QueryKey, QueryObserver, QueryClient } from '@tanstack/query-core';

interface Register {
}
type DefaultError = Register extends {
    defaultError: infer TError;
} ? TError : Error;
interface ResultOptions {
    throwOnError?: boolean;
}
interface RefetchOptions extends ResultOptions {
    cancelRefetch?: boolean;
}
type QueryStatus = 'pending' | 'error' | 'success';
type FetchStatus = 'fetching' | 'paused' | 'idle';
interface QueryObserverBaseResult<TData = unknown, TError = DefaultError> {
    data: TData | undefined;
    dataUpdatedAt: number;
    error: TError | null;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: TError | null;
    errorUpdateCount: number;
    isError: boolean;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isLoading: boolean;
    isPending: boolean;
    isLoadingError: boolean;
    /**
     * @deprecated isInitialLoading is being deprecated in favor of isLoading
     * and will be removed in the next major version.
     */
    isInitialLoading: boolean;
    isPaused: boolean;
    isPlaceholderData: boolean;
    isRefetchError: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isSuccess: boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<TData, TError>>;
    status: QueryStatus;
    fetchStatus: FetchStatus;
}
interface QueryObserverLoadingResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
    data: undefined;
    error: null;
    isError: false;
    isPending: true;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: false;
    status: 'pending';
}
interface QueryObserverLoadingErrorResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
    data: undefined;
    error: TError;
    isError: true;
    isPending: false;
    isLoadingError: true;
    isRefetchError: false;
    isSuccess: false;
    status: 'error';
}
interface QueryObserverRefetchErrorResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
    data: TData;
    error: TError;
    isError: true;
    isPending: false;
    isLoadingError: false;
    isRefetchError: true;
    isSuccess: false;
    status: 'error';
}
interface QueryObserverSuccessResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
    data: TData;
    error: null;
    isError: false;
    isPending: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    status: 'success';
}
type DefinedQueryObserverResult<TData = unknown, TError = DefaultError> = QueryObserverRefetchErrorResult<TData, TError> | QueryObserverSuccessResult<TData, TError>;
type QueryObserverResult<TData = unknown, TError = DefaultError> = DefinedQueryObserverResult<TData, TError> | QueryObserverLoadingErrorResult<TData, TError> | QueryObserverLoadingResult<TData, TError>;

declare function useBaseQuery<TQueryFnData, TError, TData, TQueryData, TQueryKey extends QueryKey>(options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>, Observer: typeof QueryObserver, queryClient?: QueryClient): QueryObserverResult<TData, TError>;

export { useBaseQuery };
