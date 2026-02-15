import { Badge, Button, IconButton } from '@design-sync/uikit';
import { Show } from 'solid-js';
import type { RemoteStorage } from '../../shared/types';

interface StorageCardProps {
  storage: RemoteStorage;
  isActive: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function StorageCard(props: StorageCardProps) {
  return (
    <div style={{
      display: 'flex',
      'flex-direction': 'column',
      gap: '8px',
      padding: '12px',
      border: '1px solid var(--figma-color-border, #e6e6e6)',
      'border-radius': '6px',
    }}>
      <div style={{ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center' }}>
        <div style={{ display: 'flex', 'align-items': 'center', gap: '8px' }}>
          <span style={{ 'font-weight': 600, 'font-size': '12px' }}>{props.storage.name}</span>
          <Show when={props.isActive}>
            <Badge intent="success">Active</Badge>
          </Show>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Show when={!props.isActive}>
            <Button intent="secondary" onClick={props.onActivate}>Activate</Button>
          </Show>
          <IconButton
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
              </svg>
            }
            onClick={props.onEdit}
          />
          <IconButton
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            }
            onClick={props.onDelete}
          />
        </div>
      </div>
      <span style={{ 'font-size': '11px', opacity: 0.6, 'word-break': 'break-all' }}>{props.storage.uri}</span>
    </div>
  );
}
