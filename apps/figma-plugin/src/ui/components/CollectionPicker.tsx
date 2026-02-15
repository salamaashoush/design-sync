import { Checkbox, Spinner, EmptyState } from '@design-sync/uikit';
import { For, Show } from 'solid-js';
import { useRpcQuery } from '../hooks/useRpc';

interface CollectionPickerProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function CollectionPicker(props: CollectionPickerProps) {
  const [collections] = useRpcQuery('variables/get');

  return (
    <Show when={collections()} fallback={<Spinner size="sm" />}>
      <Show when={collections()!.local.length > 0} fallback={
        <EmptyState title="No collections" description="Create variable collections in Figma first" />
      }>
        <div style={{ display: 'flex', 'flex-direction': 'column', gap: '4px' }}>
          <For each={collections()!.local}>
            {(col) => (
              <Checkbox
                label={col.name}
                checked={props.selectedIds.includes(col.id)}
                onChange={() => props.onToggle(col.id)}
              />
            )}
          </For>
        </div>
      </Show>
    </Show>
  );
}
