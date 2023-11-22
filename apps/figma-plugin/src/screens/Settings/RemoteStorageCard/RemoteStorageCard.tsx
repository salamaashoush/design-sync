import { Bold, IconAdjust32, IconButton, IconTrash32, Text } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { Box } from '../../../components/Box.tsx';
import { remoteStorageCard } from './remoteStorageCard.css.ts';

interface RemoteStorageCardProps {
  onDelete: () => void;
  onEdit: () => void;
  selected: boolean;
  onActivate: () => void;
  name: string;
}

export function RemoteStorageCard({ onDelete, onEdit, onActivate, selected, name }: RemoteStorageCardProps) {
  return (
    <div
      class={remoteStorageCard({ selected })}
      onClick={() => {
        if (!selected) {
          onActivate();
        }
      }}
    >
      <Text>
        <Bold>{name}</Bold>
      </Text>
      <Box align="center" justify="flex-end">
        <IconButton onClick={onEdit}>
          <IconAdjust32 />
        </IconButton>
        <IconButton onClick={onDelete}>
          <IconTrash32 />
        </IconButton>
      </Box>
    </div>
  );
}
