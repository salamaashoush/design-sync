import { Button } from '@create-figma-plugin/ui';
import { useComputed, useSignal } from '@preact/signals';
import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { Box } from '../../components/Box';
import { TextInput } from '../../components/TextInput';

export interface RemoteStorageFormData {
  name: string;
  uri: string;
  accessToken: string;
  apiUrl?: string;
}

interface RemoteStorageFormProps {
  onSubmit: (values: RemoteStorageFormData) => void;
  values?: RemoteStorageFormData;
  editMode?: boolean;
}
export function RemoteStorageForm(props: RemoteStorageFormProps) {
  const uri = useSignal(props.values?.uri ?? '');
  const name = useSignal(props.values?.name ?? '');
  const accessToken = useSignal(props.values?.accessToken ?? '');
  const apiUrl = useSignal(props.values?.apiUrl);
  const disabled = useComputed(() => !uri.value || !name.value);
  console.log('RemoteStorageForm', props.values);
  const handleSubmit = useCallback(() => {
    props.onSubmit({
      name: name.value,
      uri: uri.value,
      apiUrl: apiUrl.value,
      accessToken: accessToken.value,
    });
    console.log('handleSubmit', name.value, uri.value, apiUrl.value);
  }, []);

  return (
    <Box direction="column">
      <TextInput
        name="name"
        onChange={(e) => {
          name.value = e.currentTarget.value;
        }}
        label="Name"
        placeholder="Gitlab"
        value={name}
        required
      />

      <TextInput
        name="uri"
        label="Repo URI"
        placeholder="github:owner/repo#ref/path/to/folder"
        value={uri}
        onChange={(e) => {
          uri.value = e.currentTarget.value;
        }}
        required
      />

      <TextInput
        name="accessToken"
        label="Access token"
        placeholder="********"
        value={accessToken}
        onChange={(e) => {
          accessToken.value = e.currentTarget.value;
        }}
        required
      />

      <TextInput
        name="apiUrl"
        label="API URL (optional)"
        placeholder='e.g. "https://api.github.com"'
        value={apiUrl}
        onChange={(e) => {
          apiUrl.value = e.currentTarget.value;
        }}
      />

      <Box justify="flex-end" paddingX="medium">
        <Button onClick={handleSubmit} disabled={disabled.value}>
          {props.editMode ? 'Update' : 'Add'}
        </Button>
      </Box>
    </Box>
  );
}
