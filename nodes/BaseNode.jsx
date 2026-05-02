import { Handle, Position } from 'reactflow';
import { useState } from 'react';

export const NODE_COLORS = {
  customInput:  '#a78bfa',
  llm:          '#34d399',
  customOutput: '#fb923c',
  text:         '#60a5fa',
  filter:       '#f472b6',
  transform:    '#facc15',
  note:         '#94a3b8',
  api:          '#2dd4bf',
  merge:        '#c084fc',
};

/**
 * BaseNode — shared shell for every node type.
 *
 * Props:
 *   id          – ReactFlow node id
 *   title       – Header label
 *   icon        – Emoji or string shown left of title
 *   nodeType    – Key into NODE_COLORS for accent color
 *   fields      – Array of field descriptors (see below)
 *   handles     – Array of handle descriptors (see below)
 *   style       – Extra styles merged into the root div
 *   children    – Extra JSX rendered at the bottom of the body
 *   onFieldChange(name, value) – Optional callback
 *
 * Field descriptor:
 *   { name, label?, type, placeholder?, defaultValue?, options? }
 *   type: 'text' | 'textarea' | 'select' | any <input type>
 *
 * Handle descriptor:
 *   { id, type, position, style? }
 */
export const BaseNode = ({
  id,
  title,
  icon,
  fields = [],
  handles = [],
  nodeType,
  style = {},
  children,
  onFieldChange,
}) => {
  const accent = NODE_COLORS[nodeType] || '#a78bfa';

  // Initialise field state from defaultValue / first option
  const initState = {};
  fields.forEach(f => {
    initState[f.name] =
      f.defaultValue ?? (f.type === 'select' ? f.options?.[0] : '');
  });
  const [values, setValues] = useState(initState);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    onFieldChange?.(name, value);
  };

  return (
    <div
      style={{
        minWidth: 215,
        background: '#111827',
        border: '1px solid #1e3a5f',
        borderTop: `2px solid ${accent}`,
        borderRadius: 10,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        ...style,
      }}
    >
      {/* Handles */}
      {handles.map(h => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={`${id}-${h.id}`}
          style={{
            background: accent,
            border: `2px solid ${accent}88`,
            width: 10,
            height: 10,
            ...h.style,
          }}
        />
      ))}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 13px 8px',
          borderBottom: '1px solid #1e2d40',
        }}
      >
        {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: accent,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {title}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '10px 13px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {fields.map(f => (
          <div key={f.name}>
            {f.label && (
              <div
                style={{
                  fontSize: 10,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 3,
                }}
              >
                {f.label}
              </div>
            )}

            {f.type === 'select' ? (
              <select
                value={values[f.name]}
                onChange={e => handleChange(f.name, e.target.value)}
                style={fieldStyle}
              >
                {f.options.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                value={values[f.name]}
                placeholder={f.placeholder}
                onChange={e => handleChange(f.name, e.target.value)}
                rows={3}
                style={{
                  ...fieldStyle,
                  resize: 'vertical',
                  minHeight: 60,
                  lineHeight: 1.5,
                }}
              />
            ) : (
              <input
                type={f.type || 'text'}
                value={values[f.name]}
                placeholder={f.placeholder}
                onChange={e => handleChange(f.name, e.target.value)}
                style={fieldStyle}
              />
            )}
          </div>
        ))}

        {children}
      </div>
    </div>
  );
};

export const fieldStyle = {
  width: '100%',
  background: '#0d1117',
  border: '1px solid #2d3f57',
  borderRadius: 6,
  color: '#cbd5e1',
  fontSize: 12,
  padding: '5px 8px',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
};