import { RpcClient, createFigmaUITransport } from "@design-sync/rpc";

export const client = new RpcClient(createFigmaUITransport());
