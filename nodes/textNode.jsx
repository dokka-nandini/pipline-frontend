import { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

// Matches {{ validJsVarName }} with optional spaces
const VAR_REGEX = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

function extractVariables(text) {
  const seen = new Set();
  const vars = [];
  let match;
  VAR_REGEX.lastIndex = 0;
  while ((match = VAR_REGEX.exec(text)) !== null) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      vars.push(match[1]);
    }
  }
  return vars;
}

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  // Auto-resize textarea height to fit content
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(60, el.scrollHeight)}px`;
  }, []);

  // Re-parse variables + resize whenever text changes
  useEffect(() => {
    const vars = extractVariables(text);
    setVariables(vars);
    autoResize();
    // Notify ReactFlow that handle count changed so edges re-anchor
    updateNodeInternals(id);
  }, [text, id, autoResize, updateNodeInternals]);

  // Resize once on mount
  useEffect(() => { autoResize(); }, [autoResize]);

  // Spread handles evenly along the left edge
  const getHandleTop = (index, total) => {
    const step = 100 / (total + 1);
    return `${step * (index + 1)}%`;
  };

  return (
    <div
      style={{
        minWidth: 220,
        maxWidth: 400,
        background: '#111827',
        border: '1px solid #1e3a5f',
        borderTop: '2px solid #60a5fa',
        borderRadius: 10,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        transition: 'width 0.15s, height 0.15s',
      }}
    >
      {/* Dynamic input handles — one per {{variable}} */}
      {variables.map((varName, index) => (
        <Handle
          key={varName}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: getHandleTop(index, variables.length),
            background: '#60a5fa',
            border: '2px solid #3b82f688',
            width: 10,
            height: 10,
          }}
          title={varName}
        />
      ))}

      {/* Fixed output handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          background: '#60a5fa',
          border: '2px solid #3b82f688',
          width: 10,
          height: 10,
        }}
      />

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
        <span style={{ fontSize: 13 }}>📝</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#60a5fa',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Text
        </span>
        {variables.length > 0 && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 10,
              background: '#1e3a5f',
              color: '#60a5fa',
              padding: '2px 7px',
              borderRadius: 4,
              border: '1px solid #3b82f633',
            }}
          >
            {variables.length} var{variables.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 13px 13px' }}>
        <div
          style={{
            fontSize: 10,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 4,
          }}
        >
          Content
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type text… use {{variable}} to add input handles"
          rows={3}
          style={{
            width: '100%',
            background: '#0d1117',
            border: '1px solid #2d3f57',
            borderRadius: 6,
            color: '#cbd5e1',
            fontSize: 12,
            padding: '7px 9px',
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            resize: 'none',        // node grows instead
            overflowY: 'hidden',   // no scrollbar
            lineHeight: 1.6,
            minHeight: 60,
            display: 'block',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocus={e  => (e.target.style.borderColor = '#60a5fa')}
          onBlur={e   => (e.target.style.borderColor = '#2d3f57')}
        />

        {/* Variable labels */}
        {variables.length > 0 && (
          <div
            style={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {variables.map(v => (
              <div
                key={v}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  color: '#94a3b8',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#60a5fa',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#60a5fa',
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};