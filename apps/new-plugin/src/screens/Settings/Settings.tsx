import { IconButton, IconPlus32, Modal } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Box } from '../../components/Box';
import { Section } from '../../components/Section';
import { useRemoteStorages } from '../../hooks/useRemoteStorages';
import { RemoteStorageType } from '../../types';
import { RemoteStorageCard } from './RemoteStorageCard';
import { RemoteStorageForm, RemoteStorageFormData } from './RemoteStorageForm';

export function Settings() {
  const { remoteStorages, addRemoteStorage, removeRemoteStorage, activateRemoteStorage, activeRemoteStorage } =
    useRemoteStorages();

  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);
  const handleFormSubmit = useCallback(
    (values: RemoteStorageFormData) => {
      addRemoteStorage([
        {
          name: values.name,
          type: values.type as RemoteStorageType,
          settings: values,
        },
      ]);
      handleModalClose();
    },
    [handleModalClose],
  );

  return (
    <Section
      title="Remote storages"
      action={
        <IconButton onClick={handleModalOpen}>
          <IconPlus32 />
        </IconButton>
      }
    >
      <Modal open={open} onCloseButtonClick={handleModalClose} title="Add remote storage" position="bottom">
        {open && <RemoteStorageForm onSubmit={handleFormSubmit} />}
      </Modal>
      <Box flexDirection="column" gap="extraSmall">
        {remoteStorages?.map((remoteStorage) => (
          <RemoteStorageCard
            onDelete={() => removeRemoteStorage([remoteStorage.id])}
            onEdit={() => activateRemoteStorage([remoteStorage.id])}
            seleted={activeRemoteStorage?.id === remoteStorage.id}
            name={remoteStorage.name}
          />
        ))}
      </Box>
    </Section>
  );
}
