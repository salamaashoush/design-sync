import { RpcCallParams, RpcCallResult } from '@design-sync/json-rpc-utils';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { client } from '../rpc/client';

type UseRpcQueryOptions<Call extends keyof RpcCalls, T = RpcCallResult<Call>> = Omit<
  UseQueryOptions<RpcCallResult<Call>, Error, T>,
  'queryKey' | 'queryFn'
>;
export function useRpcQuery<Call extends keyof RpcCalls, T = RpcCallResult<Call>>(
  call: Call,
  params?: RpcCallParams<Call>,
  options: UseRpcQueryOptions<Call, T> = {},
) {
  return useQuery({
    queryKey: [call, ...(params ?? [])],
    queryFn: async () => client.call(call, ...(params ?? ([] as any))),
    ...options,
  });
}

type VoidIfEmpty<T extends any[]> = T extends [any, ...any[]] ? T : void;
type UseRpcMutationOptions<Call extends keyof RpcCalls> = Omit<
  UseMutationOptions<RpcCallResult<Call>, Error, VoidIfEmpty<RpcCallParams<Call>>>,
  'mutationKey' | 'mutationFn'
>;
export function useRpcMutation<Call extends keyof RpcCalls>(call: Call, options: UseRpcMutationOptions<Call> = {}) {
  return useMutation<RpcCallResult<Call>, Error, VoidIfEmpty<RpcCallParams<Call>>>({
    mutationKey: [call],
    mutationFn: async (params) => client.call(call, ...(params ?? ([] as any))),
    ...options,
  });
}
