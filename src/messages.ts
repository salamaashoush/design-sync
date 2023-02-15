import { Token } from "./types";

export const MessageType = {
  ApplyToken: "apply-token",
  ApplyTokenToSelection: "apply-token-to-selection",
  Resize: "resize",
} as const;

export type Message =
  | {
      type: typeof MessageType.ApplyToken;
      payload: {
        path: string;
        token: Token;
      };
    }
  | {
      type: typeof MessageType.ApplyTokenToSelection;
      payload: {
        path: string;
        token: Token;
      };
    }
  | {
      type: typeof MessageType.Resize;
      payload: {
        width: number;
        height: number;
      };
    };
