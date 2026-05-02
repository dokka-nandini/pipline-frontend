import { useEffect } from 'react';

export const PipelineResultModal = ({ result, error, onClose }) => {
  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Card — stop click propagating to backdrop */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111827',
          border: '1px solid #1e3a5f',
          borderRadius: 14,
          padding: '28px 32px',
          minWidth: 340,
          maxWidth: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          fontFamily: "'DM Sans', sans-serif",
          animation: 'modalIn 0.2s ease',
        }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);   }
          }
        `}</style>

        {error ? (
          /* ── Error state ── */
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>❌</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#f87171' }}>
                Submit failed
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
              {error}
            </p>
            <p style={{ fontSize: 12, color: '#4b5563', marginTop: 8 }}>
              Make sure the backend is running on{' '}
              <code style={{ color: '#a78bfa' }}>localhost:8000</code>.
            </p>
          </>
        ) : (
          /* ── Success state ── */
          <>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 20 }}>🔍</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0' }}>
                Pipeline Analysis
              </span>
            </div>

            {/* Stats grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <StatCard label="Nodes" value={result.num_nodes} color="#a78bfa" />
              <StatCard label="Edges" value={result.num_edges} color="#60a5fa" />
              <StatCard
                label="Is DAG"
                value={result.is_dag ? 'Yes' : 'No'}
                color={result.is_dag ? '#34d399' : '#f87171'}
              />
            </div>

            {/* DAG explanation banner */}
            <div
              style={{
                background: result.is_dag ? '#052e16' : '#2d0a0a',
                border: `1px solid ${result.is_dag ? '#16a34a' : '#dc2626'}`,
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: result.is_dag ? '#4ade80' : '#f87171',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {result.is_dag
                  ? '✓ Your pipeline has no cycles — it can be executed in a valid topological order.'
                  : '✗ A cycle was detected. Pipelines must be directed acyclic graphs to run correctly.'}
              </p>
            </div>

            {/* Empty pipeline hint */}
            {result.num_nodes === 0 && (
              <p style={{ fontSize: 12, color: '#4b5563', marginBottom: 16 }}>
                Tip: drag some nodes onto the canvas before submitting.
              </p>
            )}
          </>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 8,
            padding: '9px 0',
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#273548';
            e.currentTarget.style.color = '#e2e8f0';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#1e293b';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Individual stat card
const StatCard = ({ label, value, color }) => (
  <div
    style={{
      background: '#0d1117',
      border: '1px solid #1e2d40',
      borderRadius: 8,
      padding: '12px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    }}
  >
    <span
      style={{
        fontSize: 22,
        fontWeight: 700,
        color,
        letterSpacing: '-0.02em',
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontSize: 10,
        color: '#4b5563',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
      }}
    >
      {label}
    </span>
  </div>
);