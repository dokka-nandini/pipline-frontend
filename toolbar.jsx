import { DraggableNode } from './draggableNode';

const NODE_CONFIG = [
  { type: 'customInput', label: 'Input',     color: '#a78bfa', icon: '📥' },
  { type: 'llm',         label: 'LLM',       color: '#34d399', icon: '🤖' },
  { type: 'customOutput',label: 'Output',    color: '#fb923c', icon: '📤' },
  { type: 'text',        label: 'Text',      color: '#60a5fa', icon: '📝' },
  { type: 'filter',      label: 'Filter',    color: '#f472b6', icon: '🔍' },
  { type: 'transform',   label: 'Transform', color: '#facc15', icon: '⚙️' },
  { type: 'note',        label: 'Note',      color: '#94a3b8', icon: '📌' },
  { type: 'api',         label: 'API Call',  color: '#2dd4bf', icon: '🌐' },
  { type: 'merge',       label: 'Merge',     color: '#c084fc', icon: '🔀' },
];

export const PipelineToolbar = () => (
  <div style={{
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border)',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    minHeight: 60,
  }}>
    <span style={{
      fontSize: 10,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginRight: 4,
      whiteSpace: 'nowrap',
    }}>
      Nodes
    </span>
    {NODE_CONFIG.map(({ type, label, color, icon }) => (
      <DraggableNode key={type} type={type} label={label} color={color} icon={icon} />
    ))}
  </div>
);