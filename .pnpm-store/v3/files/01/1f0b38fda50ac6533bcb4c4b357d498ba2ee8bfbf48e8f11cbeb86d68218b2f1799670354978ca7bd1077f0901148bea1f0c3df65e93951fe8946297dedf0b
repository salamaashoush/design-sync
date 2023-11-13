import { UseQueryResult, UseQueryOptions } from './types.cjs';
import { DefaultError, QueryClient, QueryKey, QueriesPlaceholderDataFunction, QueryFunction, ThrowOnError } from '@tanstack/query-core';

type UseQueryOptionsForUseQueries<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'placeholderData' | 'suspense'> & {
    placeholderData?: TQueryFnData | QueriesPlaceholderDataFunction<TQueryFnData>;
};
type MAXIMUM_DEPTH = 20;
type GetOptions<T> = T extends {
    queryFnData: infer TQueryFnData;
    error?: infer TError;
    data: infer TData;
} ? UseQueryOptionsForUseQueries<TQueryFnData, TError, TData> : T extends {
    queryFnData: infer TQueryFnData;
    error?: infer TError;
} ? UseQueryOptionsForUseQueries<TQueryFnData, TError> : T extends {
    data: infer TData;
    error?: infer TError;
} ? UseQueryOptionsForUseQueries<unknown, TError, TData> : T extends [infer TQueryFnData, infer TError, infer TData] ? UseQueryOptionsForUseQueries<TQueryFnData, TError, TData> : T extends [infer TQueryFnData, infer TError] ? UseQueryOptionsForUseQueries<TQueryFnData, TError> : T extends [infer TQueryFnData] ? UseQueryOptionsForUseQueries<TQueryFnData> : T extends {
    queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey>;
    select: (data: any) => infer TData;
    throwOnError?: ThrowOnError<any, infer TError, any, any>;
} ? UseQueryOptionsForUseQueries<TQueryFnData, TError, TData, TQueryKey> : T extends {
    queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey>;
    throwOnError?: ThrowOnError<any, infer TError, any, any>;
} ? UseQueryOptionsForUseQueries<TQueryFnData, TError, TQueryFnData, TQueryKey> : UseQueryOptionsForUseQueries;
type GetResults<T> = T extends {
    queryFnData: any;
    error?: infer TError;
    data: infer TData;
} ? UseQueryResult<TData, TError> : T extends {
    queryFnData: infer TQueryFnData;
    error?: infer TError;
} ? UseQueryResult<TQueryFnData, TError> : T extends {
    data: infer TData;
    error?: infer TError;
} ? UseQueryResult<TData, TError> : T extends [any, infer TError, infer TData] ? UseQueryResult<TData, TError> : T extends [infer TQueryFnData, infer TError] ? UseQueryResult<TQueryFnData, TError> : T extends [infer TQueryFnData] ? UseQueryResult<TQueryFnData> : T extends {
    queryFn?: QueryFunction<unknown, any>;
    select: (data: any) => infer TData;
    throwOnError?: ThrowOnError<any, infer TError, any, any>;
} ? UseQueryResult<TData, unknown extends TError ? DefaultError : TError> : T extends {
    queryFn?: QueryFunction<infer TQueryFnData, any>;
    throwOnError?: ThrowOnError<any, infer TError, any, any>;
} ? UseQueryResult<TQueryFnData, unknown extends TError ? DefaultError : TError> : UseQueryResult;
/**
 * QueriesOptions reducer recursively unwraps function arguments to infer/enforce type param
 */
type QueriesOptions<T extends Array<any>, Result extends Array<any> = [], Depth extends ReadonlyArray<number> = []> = Depth['length'] extends MAXIMUM_DEPTH ? Array<UseQueryOptionsForUseQueries> : T extends [] ? [] : T extends [infer Head] ? [...Result, GetOptions<Head>] : T extends [infer Head, ...infer Tail] ? QueriesOptions<[...Tail], [...Result, GetOptions<Head>], [...Depth, 1]> : Array<unknown> extends T ? T : T extends Array<UseQueryOptionsForUseQueries<infer TQueryFnData, infer TError, infer TData, infer TQueryKey>> ? Array<UseQueryOptionsForUseQueries<TQueryFnData, TError, TData, TQueryKey>> : Array<UseQueryOptionsForUseQueries>;
/**
 * QueriesResults reducer recursively maps type param to results
 */
type QueriesResults<T extends Array<any>, Result extends Array<any> = [], Depth extends ReadonlyArray<number> = []> = Depth['length'] extends MAXIMUM_DEPTH ? Array<UseQueryResult> : T extends [] ? [] : T extends [infer Head] ? [...Result, GetResults<Head>] : T extends [infer Head, ...infer Tail] ? QueriesResults<[...Tail], [...Result, GetResults<Head>], [...Depth, 1]> : T extends Array<UseQueryOptionsForUseQueries<infer TQueryFnData, infer TError, infer TData, any>> ? Array<UseQueryResult<unknown extends TData ? TQueryFnData : TData, unknown extends TError ? DefaultError : TError>> : Array<UseQueryResult>;
declare function useQueries<T extends Array<any>, TCombinedResult = QueriesResults<T>>({ queries, ...options }: {
    queries: readonly [...QueriesOptions<T>];
    combine?: (result: QueriesResults<T>) => TCombinedResult;
}, queryClient?: QueryClient): TCombinedResult;

export { QueriesOptions, QueriesResults, useQueries };
