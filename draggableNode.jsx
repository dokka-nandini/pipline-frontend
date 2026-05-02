export const DraggableNode = ({ type, label, color = '#a78bfa', icon }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 12px',
        borderRadius: 8,
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-light)',
        cursor: 'grab',
        fontSize: 12,
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)',
        transition: 'all 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.color = color;
        e.currentTarget.style.background = 'var(--bg-surface)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-light)';
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'var(--bg-hover)';
      }}
      onDragEnd={e => {
        e.currentTarget.style.cursor = 'grab';
      }}
    >
      {/* Accent dot */}
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
      <span>{label}</span>
    </div>
  );
};