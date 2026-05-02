import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => (
  <BaseNode
    id={id}
    nodeType="note"
    title="Note"
    icon="📌"
    fields={[
      {
        name: 'note',
        label: 'Note',
        type: 'textarea',
        placeholder: 'Add a note or comment...',
        defaultValue: data?.note || '',
      },
    ]}
    handles={[]}
    style={{
      background: '#2d2a1e',
      border: '1px solid #ca8a04',
      borderTop: '2px solid #facc15',
    }}
  />
);