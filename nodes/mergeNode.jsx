import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => (
  <BaseNode
    id={id}
    nodeType="merge"
    title="Merge"
    icon="🔀"
    fields={[
      {
        name: 'separator',
        label: 'Separator',
        type: 'text',
        placeholder: '\\n',
        defaultValue: data?.separator || '\\n',
      },
      {
        name: 'strategy',
        label: 'Strategy',
        type: 'select',
        options: ['concatenate', 'array', 'object merge'],
        defaultValue: data?.strategy || 'concatenate',
      },
    ]}
    handles={[
      { type: 'target', position: Position.Left,  id: 'input1', style: { top: '33%' } },
      { type: 'target', position: Position.Left,  id: 'input2', style: { top: '66%' } },
      { type: 'source', position: Position.Right, id: 'output' },
    ]}
  />
);