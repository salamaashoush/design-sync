import { Bold, Text } from '@create-figma-plugin/ui';
import { RenderableProps, h } from 'preact';
import { Box } from './Box.tsx';
import { errorStyle } from './formField.css.ts';

interface FormFieldProps {
  label?: string;
  error?: string;
}
export function FormField(props: RenderableProps<FormFieldProps>) {
  return (
    <Box direction="column" gap="small" padding="small" justify="flex-start">
      {props.label && (
        <Text>
          <Bold>{props.label}</Bold>
        </Text>
      )}
      {props.children}
      {props.error && <Text className={errorStyle}>{props.error}</Text>}
    </Box>
  );
}
