import { createSignal, For } from "solid-js";
import { Token, TokenSet } from "../types";
import { TokensEditor } from "./TokensEditor";

interface TokensProps {
  sets: TokenSet[];
  onTokenClick?: (args: [string, Token]) => void;
}

export function Tokens(props: TokensProps) {
  console.log("Tokens", props.sets);
  const [selected, setSelectedSets] = createSignal<string[]>([]);
  const [activeSet, setActiveSet] = createSignal(0);
  const handleSetSelect = (e) => {
    setSelectedSets((prev) => {
      if (prev.includes(e.target.value)) {
        return prev.filter((set) => set !== e.target.value);
      }
      return [...prev, e.target.value];
    });
  };

  return (
    <div>
      <For each={props.sets}>
        {(set, index) => (
          <div
            onClick={() => {
              setActiveSet(index());
            }}
          >
            <input
              type="checkbox"
              id={set.id}
              value={set.id}
              onInput={handleSetSelect}
              checked={selected().includes(set.id)}
            />
            <label for={set.id}>{set.name}</label>
          </div>
        )}
      </For>
      <TokensEditor
        set={props.sets[activeSet()]}
        onTokenClick={props.onTokenClick}
      />
    </div>
  );
}
