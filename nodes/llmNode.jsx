import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="LLM"
    icon="🤖"
    fields={[
      { name: 'model', label: 'Model', type: 'select',
        options: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-5-sonnet'],
        defaultValue: data?.model || 'gpt-4o' },
      { name: 'temperature', label: 'Temperature', type: 'select',
        options: ['0', '0.3', '0.7', '1.0'], defaultValue: data?.temperature || '0.7' },
    ]}
    handles={[
      { type: 'target', position: Position.Left, id: 'system', style: { top: '33%' } },
      { type: 'target', position: Position.Left, id: 'prompt', style: { top: '66%' } },
      { type: 'source', position: Position.Right, id: 'response' },
    ]}
  />
);