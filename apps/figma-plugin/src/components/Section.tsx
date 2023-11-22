import { Bold, Text } from '@create-figma-plugin/ui';
import { JSX, RenderableProps, h } from 'preact';
import { Box } from './Box';

interface SectionProps {
  title: string;
  action?: JSX.Element;
}

export function Section(props: RenderableProps<SectionProps>) {
  return (
    <Box direction="column" gap="medium" padding="small" justify="flex-start">
      <Box align="center" justify="space-between">
        <Text>
          <Bold>{props.title}</Bold>
        </Text>
        <div>{props.action}</div>
      </Box>
      {props.children}
    </Box>
  );
}
