import './Sidebar.css';

function Sidebar({ items, activeItem, onSelect, lullabyOn, onToggleLullaby, onPageTurn, onNarrate, speaking }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Library</h2>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-controls">
        <button className="sidebar-control-btn" onClick={onToggleLullaby}>
          {lullabyOn ? '\u23F9 Stop Lullaby' : '\u266B Lullaby'}
        </button>
        <button className="sidebar-control-btn" onClick={onPageTurn}>
          {'\uD83D\uDCC4 Turn Page'}
        </button>
        <button className="sidebar-control-btn" onClick={onNarrate} disabled={speaking}>
          {speaking ? '\uD83D\uDDE3\uFE0F Narrating\u2026' : '\uD83E\uDDD9 Narrate'}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
