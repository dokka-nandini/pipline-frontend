import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    nodeType="customOutput"
    title="Output"
    icon="📤"
    fields={[
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        placeholder: 'output_result',
        defaultValue: data?.outputName || id.replace('customOutput-', 'output_'),
      },
      {
        name: 'format',
        label: 'Format',
        type: 'select',
        options: ['Text', 'JSON', 'Markdown'],
        defaultValue: data?.format || 'Text',
      },
    ]}
    handles={[
      {
        type: 'target',
        position: Position.Left,
        id: `${id}-input`,
      },
    ]}
    color="#fb923c"
  />
);