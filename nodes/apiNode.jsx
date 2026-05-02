import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => (
  <BaseNode
    id={id}
    nodeType="api"
    title="API Call"
    icon="🌐"
    fields={[
      {
        name: 'url',
        label: 'URL',
        type: 'text',
        placeholder: 'https://api.example.com/...',
        defaultValue: data?.url || '',
      },
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        defaultValue: data?.method || 'GET',
      },
      {
        name: 'headers',
        label: 'Headers (JSON)',
        type: 'textarea',
        placeholder: '{"Authorization": "Bearer ..."}',
        defaultValue: data?.headers || '',
      },
    ]}
    handles={[
      { type: 'target', position: Position.Left,  id: 'body' },
      { type: 'source', position: Position.Right, id: 'response' },
    ]}
  />
);