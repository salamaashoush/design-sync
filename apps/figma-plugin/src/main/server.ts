import { RpcServer, createFigmaMainTransport } from "@design-sync/rpc";

export const server = new RpcServer(createFigmaMainTransport(figma.ui));
