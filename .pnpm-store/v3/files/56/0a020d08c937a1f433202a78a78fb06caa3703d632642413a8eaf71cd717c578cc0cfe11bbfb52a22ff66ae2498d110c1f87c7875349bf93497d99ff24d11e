export type EventHandler = {
    name: string;
    handler: (...args: any) => void;
};
export declare function on<Handler extends EventHandler>(name: Handler['name'], handler: Handler['handler']): () => void;
export declare function once<Handler extends EventHandler>(name: Handler['name'], handler: Handler['handler']): () => void;
export declare const emit: <Handler extends EventHandler>(name: Handler["name"], ...args: Parameters<Handler["handler"]>) => void;
//# sourceMappingURL=events.d.ts.map