import { n as Mutation, l as Query, F as QueryOptions, ao as MutationOptions, b as QueryClient, ak as MutationKey, o as MutationState, am as MutationMeta, p as QueryKey, j as QueryState, A as QueryMeta } from './queryClient-c9f8057a.js';
import './removable.cjs';
import './subscribable.cjs';

interface DehydrateOptions {
    shouldDehydrateMutation?: (mutation: Mutation) => boolean;
    shouldDehydrateQuery?: (query: Query) => boolean;
}
interface HydrateOptions {
    defaultOptions?: {
        queries?: QueryOptions;
        mutations?: MutationOptions;
    };
}
interface DehydratedMutation {
    mutationKey?: MutationKey;
    state: MutationState;
    meta?: MutationMeta;
}
interface DehydratedQuery {
    queryHash: string;
    queryKey: QueryKey;
    state: QueryState;
    meta?: QueryMeta;
}
interface DehydratedState {
    mutations: Array<DehydratedMutation>;
    queries: Array<DehydratedQuery>;
}
declare function defaultShouldDehydrateMutation(mutation: Mutation): boolean;
declare function defaultShouldDehydrateQuery(query: Query): boolean;
declare function dehydrate(client: QueryClient, options?: DehydrateOptions): DehydratedState;
declare function hydrate(client: QueryClient, dehydratedState: unknown, options?: HydrateOptions): void;

export { DehydrateOptions, DehydratedState, HydrateOptions, defaultShouldDehydrateMutation, defaultShouldDehydrateQuery, dehydrate, hydrate };
