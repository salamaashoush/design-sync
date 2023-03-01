import { For } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { Token, TokenSet } from '../types';
import { Collapsible } from './common/Collapsible';
import { createModal } from './common/Modal';

interface TokensEditorProps {
  set: TokenSet;
  onTokenClick?: (args: [string, Token]) => void;
}
export function TokensEditor(props: TokensEditorProps) {
  const { open } = createModal({
    id: 'add-color',
    title: 'Add Color',
    content: (
      <form>
        <input type="text" />
        <input type="color" />
        <button>Submit</button>
      </form>
    ),
  });
  return (
    <div class="flex flex-col overflow-auto">
      <Collapsible title="Colors" control={<button onClick={open}>Add</button>}>
        <For each={Object.entries(props.set.tokens.color ?? {})}>
          {([key, value]) => (
            <button
              style={{ 'background-color': value.value }}
              onClick={() => {
                console.log(key, value);
                props.onTokenClick?.([`color.${key}`, unwrap(value)]);
              }}
            >
              {value.name}
            </button>
          )}
        </For>
      </Collapsible>

      <h1>Borders</h1>
      <For each={Object.entries(props.set.tokens.border ?? {})}>
        {([key, value]) => (
          <button
            onClick={() => {
              props.onTokenClick?.([`border.${key}`, unwrap(value)]);
            }}
          >
            {value.name}
          </button>
        )}
      </For>

      <h1>Border Radius</h1>
      <For each={Object.entries(props.set.tokens.borderRadius ?? {})}>
        {([key, value]) => (
          <button
            onClick={() => {
              props.onTokenClick?.([`borderRadius.${key}`, unwrap(value)]);
            }}
          >
            {value.name}
          </button>
        )}
      </For>

      <h1>Shadows</h1>
      <For each={Object.entries(props.set.tokens.boxShadow ?? {})}>
        {([key, value]) => (
          <button
            onClick={() => {
              props.onTokenClick?.([`shadow.${key}`, unwrap(value)]);
            }}
          >
            {value.name}
          </button>
        )}
      </For>

      <h1>Typography</h1>
      <For each={Object.entries(props.set.tokens.typography ?? {})}>
        {([key, value]) => (
          <button
            onClick={() => {
              props.onTokenClick?.([`typography.${key}`, unwrap(value)]);
            }}
          >
            {value.name}
          </button>
        )}
      </For>

      <h1>Spacing</h1>
      <For each={Object.entries(props.set.tokens.spacing ?? {})}>
        {([key, value]) => (
          <button
            onClick={() => {
              props.onTokenClick?.([`spacing.${key}`, unwrap(value)]);
            }}
          >
            {value.name}
          </button>
        )}
      </For>

      <h1>Sizing</h1>
      <For each={Object.entries(props.set.tokens.sizing ?? {})}>
        {([key, value]) => (
          <button
            onClick={() => {
              props.onTokenClick?.([`sizing.${key}`, unwrap(value)]);
            }}
          >
            {value.name}
          </button>
        )}
      </For>

      <h1>Composition</h1>
      <For each={Object.entries(props.set.tokens.composition ?? {})}>
        {([key, value]) => (
          <button
            onClick={() => {
              props.onTokenClick?.([`composition.${key}`, unwrap(value)]);
            }}
          >
            {value.name}
          </button>
        )}
      </For>
    </div>
  );
}
