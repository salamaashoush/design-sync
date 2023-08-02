import { Plus32Icon } from '@tokenize/figma-icons';
import { Button, Collapsible, createModal } from '@tokenize/uikit';
import { For } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { Token, TokenSet } from '../types';

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
    <div class="overflow-auto flex flex-col">
      <Collapsible title="Colors" section control={<Plus32Icon onClick={open} />}>
        <For each={Object.entries(props.set.tokens.color ?? {})}>
          {([key, value]) => (
            <Button
              // style={{ 'background-color': value.value }}
              onClick={() => {
                console.log(key, value);
                props.onTokenClick?.([`color.${key}`, unwrap(value)]);
              }}
            >
              {value.name}
            </Button>
          )}
        </For>
      </Collapsible>

      <Collapsible title="Borders" section>
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
      </Collapsible>

      <Collapsible title="Border Radius" section>
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
      </Collapsible>

      <Collapsible title="Shadows" section>
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
      </Collapsible>

      <Collapsible title="Typography" section>
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
      </Collapsible>

      <Collapsible title="Spacing" section>
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
      </Collapsible>

      <Collapsible title="Sizing" section>
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
      </Collapsible>

      <Collapsible title="Composition" section>
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
      </Collapsible>
    </div>
  );
}
