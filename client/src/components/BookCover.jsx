import './BookCover.css';

/* Derive initials from an author name */
function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/* Estimate read time: ~2 minutes per step */
function readTime(stepCount) {
  const mins = Math.max(1, Math.round(stepCount * 2));
  return `${mins} min`;
}

/* Static miniature SVG graph preview */
function GraphPreview() {
  return (
    <svg
      className="cover-graph-svg"
      viewBox="0 0 320 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="320" height="180" fill="#16191f" />

      {/* Grid lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`vg-${i}`}
          x1={i * 40}
          y1="0"
          x2={i * 40}
          y2="180"
          stroke="#1e2330"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`hg-${i}`}
          x1="0"
          y1={i * 40}
          x2="320"
          y2={i * 40}
          stroke="#1e2330"
          strokeWidth="1"
        />
      ))}

      {/* Connector paths */}
      {/* Input -> Logic */}
      <path
        d="M 96 62 C 120 62 120 90 144 90"
        stroke="#4a7fa5"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Input -> Logic (second) */}
      <path
        d="M 96 118 C 120 118 120 90 144 90"
        stroke="#4a7fa5"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Logic -> Output */}
      <path
        d="M 216 90 C 236 90 236 90 256 90"
        stroke="#a5914a"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Logic -> Output (second) */}
      <path
        d="M 216 90 C 236 90 236 118 256 118"
        stroke="#a5914a"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Input nodes — blue */}
      <rect x="24" y="48" width="72" height="28" rx="5" fill="#1e3a5f" stroke="#3b7abf" strokeWidth="1.5" />
      <text x="60" y="66" textAnchor="middle" fill="#7ab8f5" fontSize="9" fontFamily="monospace">Number</text>

      <rect x="24" y="104" width="72" height="28" rx="5" fill="#1e3a5f" stroke="#3b7abf" strokeWidth="1.5" />
      <text x="60" y="122" textAnchor="middle" fill="#7ab8f5" fontSize="9" fontFamily="monospace">Level</text>

      {/* Logic node — amber */}
      <rect x="144" y="74" width="72" height="32" rx="5" fill="#3a2e10" stroke="#c4922a" strokeWidth="1.5" />
      <text x="180" y="94" textAnchor="middle" fill="#f0c060" fontSize="9" fontFamily="monospace">Wall.ByFace</text>

      {/* Output nodes — green */}
      <rect x="256" y="76" width="56" height="28" rx="5" fill="#0f2e1a" stroke="#2e8b57" strokeWidth="1.5" />
      <text x="284" y="94" textAnchor="middle" fill="#5ecb8a" fontSize="9" fontFamily="monospace">Watch</text>

      <rect x="256" y="104" width="56" height="28" rx="5" fill="#0f2e1a" stroke="#2e8b57" strokeWidth="1.5" />
      <text x="284" y="122" textAnchor="middle" fill="#5ecb8a" fontSize="9" fontFamily="monospace">Output</text>

      {/* Port dots */}
      <circle cx="96" cy="62" r="3" fill="#3b7abf" />
      <circle cx="96" cy="118" r="3" fill="#3b7abf" />
      <circle cx="144" cy="90" r="3" fill="#c4922a" />
      <circle cx="216" cy="90" r="3" fill="#c4922a" />
      <circle cx="256" cy="90" r="3" fill="#2e8b57" />
      <circle cx="256" cy="118" r="3" fill="#2e8b57" />
    </svg>
  );
}

function BookCover({ book, steps, onBack, onOpenBook, onJumpTo }) {
  const avatarBg = book.color || '#7c5cbf';
  const authorInitials = initials(book.author);

  return (
    <div className="cover-layout">
      {/* ── LEFT COLUMN ── */}
      <div className="cover-left">
        {/* Back button */}
        <button className="cover-back-btn" onClick={onBack} aria-label="Back to library">
          &larr; Library
        </button>

        {/* Graph preview */}
        <div className="cover-graph-box">
          <GraphPreview />
        </div>

        {/* Author card */}
        <div className="cov-author-card">
          <div className="cov-ava" style={{ background: avatarBg }}>
            {authorInitials}
          </div>
          <div className="cov-author-info">
            <span className="cov-author-name">{book.author || 'Unknown Author'}</span>
            <span className="cov-author-org">{book.org || 'Independent'}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="cov-tags">
          {book.category && (
            <span className="cov-tag cov-tag--category">{book.category}</span>
          )}
          {book.org && (
            <span className="cov-tag cov-tag--org">{book.org}</span>
          )}
        </div>

        {/* Save button */}
        <button className="save-btn">
          <span className="save-btn-icon">&#9825;</span>
          Save to My Library
        </button>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="cover-right">
        {/* Title */}
        <h1 className="cov-title">{book.title}</h1>

        {/* Description */}
        <p className="cov-desc">
          A step-by-step Dynamo workflow walking you through{' '}
          {book.title.toLowerCase()}. Each page explains the nodes, the
          connectors, and the logic behind the graph — making it easy to
          follow along whether you are new to computational design or a
          seasoned practitioner.
        </p>

        {/* Stats row */}
        <div className="cov-stats">
          <div className="cov-stat">
            <span className="cov-stat-value">{steps.length}</span>
            <span className="cov-stat-label">Pages</span>
          </div>
          <div className="cov-stat-divider" />
          <div className="cov-stat">
            <span className="cov-stat-value">1.2k</span>
            <span className="cov-stat-label">Reads</span>
          </div>
          <div className="cov-stat-divider" />
          <div className="cov-stat">
            <span className="cov-stat-value">{readTime(steps.length)}</span>
            <span className="cov-stat-label">Read time</span>
          </div>
          <div className="cov-stat-divider" />
          <div className="cov-stat">
            <span className="cov-stat-value">Mar 17</span>
            <span className="cov-stat-label">Updated</span>
          </div>
        </div>

        {/* Table of contents */}
        <p className="toc-heading">Table of Contents</p>
        <ul className="toc-list">
          {steps.map((step, i) => (
            <li
              key={i}
              className="toc-row"
              onClick={() => onJumpTo(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onJumpTo(i)}
            >
              <span className="toc-num">{i + 1}</span>
              <span className="toc-name">{step.title}</span>
              {step.pill && (
                <span
                  className={`toc-type t-${step.pill.toLowerCase()}`}
                  style={
                    step.pillBg
                      ? {
                          background: step.pillBg,
                          color: step.pillColor || '#fff',
                          borderColor: step.pillBorder || 'transparent',
                        }
                      : undefined
                  }
                >
                  {step.pill}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Open Book button */}
        <button className="open-btn" onClick={onOpenBook}>
          Open Book
        </button>
      </div>
    </div>
  );
}

export default BookCover;
