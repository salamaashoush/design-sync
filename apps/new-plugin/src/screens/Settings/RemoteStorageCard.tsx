import { Bold, IconButton, IconCode32, IconCross32, IconLayerComponent16, Text } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { Box } from '../../components/Box';

interface RemoteStorageCardProps {
  onDelete: () => void;
  onEdit: () => void;
  seleted: boolean;
  name: string;
}

export function RemoteStorageCard({ onDelete, onEdit, seleted, name }: RemoteStorageCardProps) {
  return (
    <Box justify="space-between" align="center">
      <Box align="center" gap="extraSmall">
        <IconLayerComponent16 />
        <Text>
          <Bold>{name}</Bold>
        </Text>
      </Box>
      <Box align="center" justify="flex-end">
        <IconButton onClick={onEdit}>
          <IconCode32 />
        </IconButton>
        <IconButton onClick={onDelete}>
          <IconCross32 />
        </IconButton>
      </Box>
    </Box>
  );
}
