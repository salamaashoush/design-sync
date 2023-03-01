import { createSignal, For } from 'solid-js';
import { client } from '../rpc';
import { Token, TokenSet } from '../types';
import { TokensEditor } from './TokensEditor';

interface TokensProps {
  sets: TokenSet[];
  onTokenClick?: (args: [string, Token]) => void;
}

export function Tokens(props: TokensProps) {
  const [selected, setSelectedSets] = createSignal<string[]>([]);
  const [activeSet, setActiveSet] = createSignal(0);
  const handleSetSelect = (e: any) => {
    console.log(e.target.value);
    setSelectedSets((prev) => {
      if (prev.includes(e.target.value)) {
        return prev.filter((set) => set !== e.target.value);
      }
      return [...prev, e.target.value];
    });
  };

  return (
    <div class="overflow-auto">
      <For each={props.sets}>
        {(set, index) => (
          <div
            onClick={() => {
              client.call('tokens/change-set', { id: set.id });
              setActiveSet(index());
            }}
          >
            <input
              type="checkbox"
              id={set.id}
              value={set.id}
              onChange={handleSetSelect}
              checked={selected().includes(set.id)}
            />
            <label for={set.id}>{set.name}</label>
          </div>
        )}
      </For>
      <TokensEditor set={props.sets[activeSet()]} onTokenClick={props.onTokenClick} />
    </div>
  );
}
