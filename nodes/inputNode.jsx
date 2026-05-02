import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    nodeType="customInput"
    title="Input"
    icon="📥"
    fields={[
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        defaultValue: data?.inputName || id.replace('customInput-', 'input_'),
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File'],
        defaultValue: data?.inputType || 'Text',
      },
    ]}
    handles={[
      { type: 'source', position: Position.Right, id: 'value' },
    ]}
  />
);