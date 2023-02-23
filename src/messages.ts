import { Token, TokenSet } from "./types";

export const UIMessageType = {
  ApplyToken: "ApplyToken",
  Resize: "Resize",
  SaveTokens: "SaveTokens",
} as const;

export interface ApplyTokenMessage {
  type: typeof UIMessageType.ApplyToken;
  payload: {
    target: "selection" | "document" | "page";
    path: string;
    token: Token;
  };
}

export interface ResizeMessage {
  type: typeof UIMessageType.Resize;
  payload: {
    width: number;
    height: number;
  };
}

export interface SaveTokensMessage {
  type: typeof UIMessageType.SaveTokens;
  payload: {
    tokenSets: TokenSet[];
  };
}

export type UIMessageEvent =
  | ApplyTokenMessage
  | ResizeMessage
  | SaveTokensMessage;

export type UIMessage = UIMessageEvent["type"];

export const PluginMessageType = {
  GetTokenSets: "GetTokenSets",
  GetTokenSetsResults: "GetTokenSetsResults",
} as const;

export interface GetTokenSetsMessage {
  type: typeof PluginMessageType.GetTokenSets;
}

export interface GetTokenSetsResultsMessage {
  type: typeof PluginMessageType.GetTokenSetsResults;
  payload: {
    tokenSets: TokenSet[];
  };
}

export type PluginMessageData = GetTokenSetsResultsMessage;

export type PluginMessageEvent = {
  data: {
    pluginMessage: PluginMessageData;
  };
};
export type PluginMessage = PluginMessageData["type"];
