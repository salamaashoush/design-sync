import { IconButton, IconPlus32, Modal } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Box } from '../../components/Box';
import { Section } from '../../components/Section';
import { useRemoteStorages } from '../../hooks/useRemoteStorages';
import { RemoteStorage, RemoteStorageWithoutId } from '../../types';
import { RemoteStorageCard } from './RemoteStorageCard/RemoteStorageCard';
import { RemoteStorageForm } from './RemoteStorageForm';

export function Settings() {
  const {
    remoteStorages,
    addRemoteStorage,
    removeRemoteStorage,
    activateRemoteStorage,
    updateRemoteStorage,
    activeRemoteStorage,
  } = useRemoteStorages();

  const [open, setOpen] = useState(false);
  const [inEdit, setInEdit] = useState<RemoteStorage | undefined>(undefined);

  const handleModalOpen = useCallback(() => {
    setOpen(true);
  }, [inEdit]);

  const handleModalClose = useCallback(() => {
    if (inEdit) {
      setInEdit(undefined);
    }
    setOpen(false);
  }, [inEdit]);

  const handleFormSubmit = useCallback(
    (values: RemoteStorageWithoutId) => {
      console.log('values', values);
      if (inEdit) {
        updateRemoteStorage([{ ...values, id: inEdit.id }]);
        setInEdit(undefined);
      } else {
        addRemoteStorage([values]);
      }
      handleModalClose();
    },
    [handleModalClose, inEdit],
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
        {open && (
          <RemoteStorageForm key={inEdit?.id ?? ''} onSubmit={handleFormSubmit} values={inEdit} editMode={!!inEdit} />
        )}
      </Modal>
      <Box flexDirection="column" gap="extraSmall">
        {remoteStorages?.map((remoteStorage) => (
          <RemoteStorageCard
            onDelete={() => removeRemoteStorage([remoteStorage.id])}
            onEdit={() => {
              setInEdit(remoteStorage);
              handleModalOpen();
            }}
            onActivate={() => activateRemoteStorage([remoteStorage.id])}
            selected={activeRemoteStorage?.id === remoteStorage.id}
            name={remoteStorage.name}
          />
        ))}
      </Box>
    </Section>
  );
}
