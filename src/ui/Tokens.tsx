import { createSignal, For } from "solid-js";
import { Tabs } from "./common/Tabs";
import { Token, TokenSet } from "../types";

interface TokensProps {
  sets: TokenSet[];
  onTokenClick?: (args: [string, Token]) => void;
}

export function Tokens({ sets, onTokenClick }: TokensProps) {
  const mappedSets = sets.map((set) => ({
    name: set.name,
    content: (
      <div class="flex flex-col">
        <h1>Colors</h1>
        <For each={Object.entries(set.tokens.color ?? {})}>
          {([key, value]) => (
            <button
              style={{ "background-color": value.value }}
              onClick={() => {
                onTokenClick?.([`color.${key}`, value]);
              }}
            >
              {value.name}
            </button>
          )}
        </For>

        <h1>Borders</h1>
        <For each={Object.entries(set.tokens.border ?? {})}>
          {([key, value]) => (
            <button
              onClick={() => {
                onTokenClick?.([`border.${key}`, value]);
              }}
            >
              {value.name}
            </button>
          )}
        </For>

        <h1>Border Radius</h1>
        <For each={Object.entries(set.tokens.borderRadius ?? {})}>
          {([key, value]) => (
            <button
              onClick={() => {
                onTokenClick?.([`borderRadius.${key}`, value]);
              }}
            >
              {value.name}
            </button>
          )}
        </For>

        <h1>Shadows</h1>
        <For each={Object.entries(set.tokens.boxShadow ?? {})}>
          {([key, value]) => (
            <button
              onClick={() => {
                onTokenClick?.([`shadow.${key}`, value]);
              }}
            >
              {value.name}
            </button>
          )}
        </For>

        <h1>Typography</h1>
        <For each={Object.entries(set.tokens.typography ?? {})}>
          {([key, value]) => (
            <button
              onClick={() => {
                onTokenClick?.([`typography.${key}`, value]);
              }}
            >
              {value.name}
            </button>
          )}
        </For>

        <h1>Spacing</h1>
        <For each={Object.entries(set.tokens.spacing ?? {})}>
          {([key, value]) => (
            <button
              onClick={() => {
                onTokenClick?.([`spacing.${key}`, value]);
              }}
            >
              {value.name}
            </button>
          )}
        </For>

        <h1>Sizing</h1>
        <For each={Object.entries(set.tokens.sizing ?? {})}>
          {([key, value]) => (
            <button
              onClick={() => {
                onTokenClick?.([`sizing.${key}`, value]);
              }}
            >
              {value.name}
            </button>
          )}
        </For>
      </div>
    ),
  }));

  return <Tabs tabs={mappedSets} mode="vertical" />;
}
