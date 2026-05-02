import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { PipelineResultModal } from './PipelineResultModal';

const selector = s => ({ nodes: s.nodes, edges: s.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // Serialize — strip ReactFlow internal position noise
    const payload = {
      nodes: nodes.map(n => ({
        id:   n.id,
        type: n.type,
        data: n.data,
      })),
      edges: edges.map(e => ({
        id:           e.id,
        source:       e.source,
        target:       e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      })),
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not reach the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Result / error modal */}
      {(result || error) && (
        <PipelineResultModal
          result={result}
          error={error}
          onClose={() => { setResult(null); setError(null); }}
        />
      )}

      {/* Bottom submit bar */}
      <div
        style={{
          background: '#111827',
          borderTop: '1px solid #1e2d40',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          flexShrink: 0,
        }}
      >
        {/* Live pipeline summary */}
        <span
          style={{
            fontSize: 11,
            color: '#4b5563',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} ·{' '}
          {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </span>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading
              ? '#374151'
              : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: loading ? '#6b7280' : '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '9px 40px',
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.03em',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={e => {
            if (!loading) e.currentTarget.style.opacity = '0.88';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {loading ? (
            <>
              <Spinner /> Analyzing…
            </>
          ) : (
            'Submit Pipeline'
          )}
        </button>
      </div>
    </>
  );
};

// Inline animated spinner
const Spinner = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    style={{ animation: 'spin 0.8s linear infinite' }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle
      cx="7" cy="7" r="5.5"
      fill="none" stroke="#6b7280" strokeWidth="2"
    />
    <path
      d="M7 1.5 A5.5 5.5 0 0 1 12.5 7"
      fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"
    />
  </svg>
);