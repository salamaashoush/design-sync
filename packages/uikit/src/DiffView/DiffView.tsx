import { For, Show } from 'solid-js';
import {
  addBadge,
  header,
  removeBadge,
  root,
  row,
  rowAdd,
  rowBadge,
  rowPath,
  rowRemove,
  rowUpdate,
  rowValue,
  statAdd,
  statRemove,
  statUpdate,
  stats,
  updateBadge,
} from './diffView.css';

export interface DiffEntry {
  path: string;
  type: 'add' | 'update' | 'remove';
  oldValue?: string;
  newValue?: string;
}

export interface DiffViewProps {
  entries: DiffEntry[];
  title?: string;
}

const badgeLabels: Record<DiffEntry['type'], string> = {
  add: '+',
  update: '~',
  remove: '-',
};

const badgeStyles: Record<DiffEntry['type'], string> = {
  add: addBadge,
  update: updateBadge,
  remove: removeBadge,
};

const rowStyles: Record<DiffEntry['type'], string> = {
  add: rowAdd,
  update: rowUpdate,
  remove: rowRemove,
};

export function DiffView(props: DiffViewProps) {
  const additions = () => props.entries.filter((e) => e.type === 'add').length;
  const updates = () => props.entries.filter((e) => e.type === 'update').length;
  const removals = () => props.entries.filter((e) => e.type === 'remove').length;

  return (
    <div class={root}>
      <div class={header}>
        <span>{props.title ?? 'Changes'}</span>
        <div class={stats}>
          <Show when={additions() > 0}>
            <span class={statAdd}>{additions()} added</span>
          </Show>
          <Show when={updates() > 0}>
            <span class={statUpdate}>{updates()} updated</span>
          </Show>
          <Show when={removals() > 0}>
            <span class={statRemove}>{removals()} removed</span>
          </Show>
        </div>
      </div>
      <For each={props.entries}>
        {(entry) => (
          <div class={`${row} ${rowStyles[entry.type]}`}>
            <span class={`${rowBadge} ${badgeStyles[entry.type]}`}>{badgeLabels[entry.type]}</span>
            <span class={rowPath}>{entry.path}</span>
            <Show when={entry.type === 'update'}>
              <span class={rowValue}>
                {entry.oldValue} &rarr; {entry.newValue}
              </span>
            </Show>
            <Show when={entry.type === 'add' && entry.newValue}>
              <span class={rowValue}>{entry.newValue}</span>
            </Show>
            <Show when={entry.type === 'remove' && entry.oldValue}>
              <span class={rowValue}>{entry.oldValue}</span>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
