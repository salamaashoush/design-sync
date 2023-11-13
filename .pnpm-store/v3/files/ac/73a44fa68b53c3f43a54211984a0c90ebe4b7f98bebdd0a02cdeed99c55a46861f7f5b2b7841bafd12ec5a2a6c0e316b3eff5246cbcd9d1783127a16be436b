"use client";

// src/useBaseQuery.ts
import * as React from "react";
import { notifyManager } from "@tanstack/query-core";
import { useQueryErrorResetBoundary } from "./QueryErrorResetBoundary.js";
import { useQueryClient } from "./QueryClientProvider.js";
import { useIsRestoring } from "./isRestoring.js";
import {
  ensurePreventErrorBoundaryRetry,
  getHasError,
  useClearResetErrorBoundary
} from "./errorBoundaryUtils.js";
import { ensureStaleTime, fetchOptimistic, shouldSuspend } from "./suspense.js";
function useBaseQuery(options, Observer, queryClient) {
  const client = useQueryClient(queryClient);
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const defaultedOptions = client.defaultQueryOptions(options);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureStaleTime(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary);
  useClearResetErrorBoundary(errorResetBoundary);
  const [observer] = React.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  React.useSyncExternalStore(
    React.useCallback(
      (onStoreChange) => {
        const unsubscribe = isRestoring ? () => void 0 : observer.subscribe(notifyManager.batchCalls(onStoreChange));
        observer.updateResult();
        return unsubscribe;
      },
      [observer, isRestoring]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  React.useEffect(() => {
    observer.setOptions(defaultedOptions, { listeners: false });
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result, isRestoring)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query: observer.getCurrentQuery()
  })) {
    throw result.error;
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
export {
  useBaseQuery
};
//# sourceMappingURL=useBaseQuery.js.map