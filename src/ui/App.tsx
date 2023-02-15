import { Component, createEffect, createSignal } from "solid-js";
import { Tabs } from "./common/Tabs";
import { TEST_TOKEN_SET_1 } from "./data";
import { Tokens } from "./Tokens";
import { Token, TokenSet } from "../types";
import { MessageType } from "../messages";
import { Resizable, ResizableEvent } from "./common/Resizable";

const App: Component = () => {
  const handleTokenClick = (args: [string, Token]) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: MessageType.ApplyToken,
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
  const [sets, setSets] = createSignal<TokenSet[]>([TEST_TOKEN_SET_1]);
  const handleResize = ({ width, height }: ResizableEvent) => {
    console.log("resize", width, height);
    parent.postMessage(
      {
        pluginMessage: {
          type: MessageType.Resize,
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
      <Tabs
        tabs={[
          {
            name: "Tokens",
            content: <Tokens sets={sets()} onTokenClick={handleTokenClick} />,
          },
          {
            name: "Tab 2",
            content: <div>Tab 2 content</div>,
          },
        ]}
      />
    </Resizable>
  );
};

export default App;
