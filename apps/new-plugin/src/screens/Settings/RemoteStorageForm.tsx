import { Button } from '@create-figma-plugin/ui';
import { useForm, valiForm } from '@modular-forms/preact';
import { h } from 'preact';
import { Input, enumType, object, optional, string, url } from 'valibot';
import { Box } from '../../components/Box';
import { SelectInput } from '../../components/SelectInput';
import { TextInput } from '../../components/TextInput';

const RemoteStorageFormSchema = object({
  type: enumType(['github', 'gitlab', 'bitbucket', 'azure-devops']),
  name: string(),
  repoPath: string(),
  accessToken: string(),
  branch: string(),
  filePath: string(),
  baseUrl: optional(string([url()])),
});

export type RemoteStorageFormData = Input<typeof RemoteStorageFormSchema>;

const RemoteStorageOptions = [
  { value: 'github', text: 'GitHub' },
  { value: 'gitlab', text: 'GitLab' },
  { value: 'bitbucket', text: 'Bitbucket' },
  { value: 'azure-devops', text: 'Azure DevOps' },
];

interface RemoteStorageFormProps {
  onSubmit: (values: RemoteStorageFormData) => void;
  values?: RemoteStorageFormData;
}
export function RemoteStorageForm(props: RemoteStorageFormProps) {
  const [syncProviderForm, { Form, Field }] = useForm<RemoteStorageFormData>({
    validate: valiForm(RemoteStorageFormSchema),
    revalidateOn: 'change',
    initialValues: {
      type: 'github',
      ...props.values,
    },
  });

  return (
    <Form onSubmit={props.onSubmit}>
      <Field name="type">
        {(field, props) => (
          <SelectInput
            label="Type"
            placeholder="Select a type"
            options={RemoteStorageOptions}
            value={field.value}
            error={field.error}
            {...props}
          />
        )}
      </Field>

      <Field name="name">
        {(field, props) => (
          <TextInput {...props} label="Name" placeholder="Gitlab" value={field.value} error={field.error} required />
        )}
      </Field>

      <Field name="accessToken">
        {(field, props) => (
          <TextInput
            {...props}
            label="Personal Access Token"
            placeholder="xxxxxxxxx"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>
      <Field name="repoPath">
        {(field, props) => (
          <TextInput
            {...props}
            label="Respositry"
            placeholder="owner/repo"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>

      <Field name="branch">
        {(field, props) => (
          <TextInput
            {...props}
            label="Branch"
            placeholder="e.g. master"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>

      <Field name="filePath">
        {(field, props) => (
          <TextInput
            {...props}
            label="File Path"
            placeholder="e.g. tokens.json or Folder Path (e.g. tokens)"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>

      <Field name="baseUrl">
        {(field, props) => (
          <TextInput
            {...props}
            label="Base URL (optional)"
            placeholder='e.g. "https://api.github.com"'
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <Box justify="flex-end" paddingX="medium">
        <Button type="submit" loading={syncProviderForm.submitting.value} disabled={syncProviderForm.submitting.value}>
          Add
        </Button>
      </Box>
    </Form>
  );
}
