import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data }) => (
  <BaseNode
    id={id}
    nodeType="transform"
    title="Transform"
    icon="⚙️"
    fields={[
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        options: [
          'uppercase',
          'lowercase',
          'trim',
          'reverse',
          'JSON parse',
          'JSON stringify',
        ],
        defaultValue: data?.operation || 'uppercase',
      },
    ]}
    handles={[
      { type: 'target', position: Position.Left,  id: 'input' },
      { type: 'source', position: Position.Right, id: 'output' },
    ]}
  />
);