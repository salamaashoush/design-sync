import { Component, createResource, Show } from "solid-js";
import { UIMessageType } from "../messages";
import { rpcClient } from "../rpc/client";
import { Token, TokenSet } from "../types";
import { Resizable, ResizableEvent } from "./common/Resizable";
import { Tokens } from "./Tokens";

interface Store {
  selectedSets: string[];
  sets: TokenSet[];
}

const App: Component = () => {
  const [setsRes] = createResource(() => rpcClient.call("token-sets/get"));
  const handleTokenClick = (args: [string, Token]) => {
    console.log("token click", args);
    parent.postMessage(
      {
        pluginMessage: {
          type: UIMessageType.ApplyToken,
          payload: {
            token: args[1],
            path: args[0],
          },
        },
        pluginId: "1206013659177640379",
      },
      "*"
    );
  };
  const handleResize = ({ width, height }: ResizableEvent) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: UIMessageType.Resize,
          payload: {
            width,
            height,
          },
        },
        pluginId: "1206013659177640379",
      },
      "*"
    );
  };

  return (
    <Resizable onResize={handleResize}>
      <Show when={setsRes()?.sets} fallback={<div>Loading...</div>}>
        <Tokens
          sets={setsRes()?.sets as TokenSet[]}
          onTokenClick={handleTokenClick}
        />
      </Show>
    </Resizable>
  );
};

export default App;
