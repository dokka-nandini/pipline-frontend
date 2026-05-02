import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    nodeType="filter"
    title="Filter"
    icon="🔍"
    fields={[
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        options: ['contains', 'equals', 'starts_with', 'ends_with', 'regex'],
        defaultValue: data?.condition || 'contains',
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        placeholder: 'Filter value...',
        defaultValue: data?.value || '',
      },
    ]}
    handles={[
      { type: 'target', position: Position.Left,  id: 'input' },
      { type: 'source', position: Position.Right, id: 'matched',   style: { top: '33%' } },
      { type: 'source', position: Position.Right, id: 'unmatched', style: { top: '66%' } },
    ]}
  />
);