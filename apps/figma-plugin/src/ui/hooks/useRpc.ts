import { createResource, createSignal } from "solid-js";
import type { RpcCallParams } from "@design-sync/rpc";
import { client } from "../rpc/client";

// Query hook - auto-fetches on mount, returns [resource, { refetch }]
export function useRpcQuery<M extends keyof RpcCalls>(method: M, ...args: RpcCallParams<M>) {
  const [resource, { refetch }] = createResource(
    () => true,
    () => client.call(method, ...(args as RpcCallParams<M>)),
  );
  return [resource, { refetch }] as const;
}

// Mutation hook - manual trigger, returns { mutate, loading, error, data }
export function useRpcMutation<M extends keyof RpcCalls>(method: M) {
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [data, setData] = createSignal<RpcCalls[M]["res"]["result"] | null>(null);

  async function mutate(...args: RpcCallParams<M>) {
    setLoading(true);
    setError(null);
    try {
      const result = await client.call(method, ...(args as RpcCallParams<M>));
      setData(() => result as RpcCalls[M]["res"]["result"]);
      return result;
    } catch (e) {
      setError(() => (e instanceof Error ? e : new Error(String(e))));
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { mutate, loading, error, data };
}
